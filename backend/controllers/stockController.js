const StockLog = require('../models/StockLog');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET stock movement logs
exports.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const filter = {};

        if (req.query.productId) filter.productId = new mongoose.Types.ObjectId(req.query.productId);
        if (req.query.changeType) filter.changeType = req.query.changeType;
        if (req.query.referenceType) filter.referenceType = req.query.referenceType;
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
        }
        if (req.query.search) {
            filter.$or = [
                { productName: { $regex: req.query.search, $options: 'i' } },
                { referenceId: { $regex: req.query.search, $options: 'i' } },
                { notes: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const [total, logs] = await Promise.all([
            StockLog.countDocuments(filter),
            StockLog.find(filter)
                .populate('performedBy', 'firstName lastName email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        res.json({
            logs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET stock summary
exports.getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const products = await Product.find({});
        let totalProducts = products.length;
        let lowStockProducts = 0;
        let outOfStockProducts = 0;
        let totalInventoryValue = 0;

        for (const product of products) {
            const colorStocks = (product.colors || []).map((c) => c.stockQuantity || 0);
            const colorTotal = colorStocks.reduce((sum, qty) => sum + qty, 0);
            const totalStock = colorTotal + (product.stockQuantity || 0);

            if (totalStock === 0) {
                outOfStockProducts++;
            } else if (totalStock <= (product.lowStockThreshold || 0)) {
                lowStockProducts++;
            }

            totalInventoryValue += totalStock * (product.price || 0);
        }

        const [todayMovements, recentLogs] = await Promise.all([
            StockLog.countDocuments({ createdAt: { $gte: today } }),
            StockLog.find()
                .populate('performedBy', 'firstName lastName email role')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        res.json({
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            totalInventoryValue,
            todayMovements,
            recentLogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET low stock products
exports.getLowStock = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });

        const filtered = products.filter((product) => {
            const colorTotal = (product.colors || []).reduce((sum, c) => sum + (c.stockQuantity || 0), 0);
            const totalStock = colorTotal + (product.stockQuantity || 0);
            return totalStock <= (product.lowStockThreshold || 0);
        });

        const result = filtered.map((p) => ({
            _id: p._id,
            name: p.name,
            category: p.category,
            price: p.price,
            stockQuantity: (p.colors || []).reduce((sum, c) => sum + (c.stockQuantity || 0), 0) + (p.stockQuantity || 0),
            lowStockThreshold: p.lowStockThreshold,
            in_stock: (p.colors || []).reduce((sum, c) => sum + (c.stockQuantity || 0), 0) + (p.stockQuantity || 0) > 0,
            image_url: p.image_url
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH adjust stock manually
exports.adjustStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, reason, changeType = 'adjustment', notes, colorName } = req.body;

        if (!quantity || quantity === 0) {
            return res.status(400).json({ message: 'Quantity change is required' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const matchedColor = colorName
            ? (product.colors || []).find((c) => c.name && c.name.toLowerCase() === String(colorName).toLowerCase())
            : null;

        let previousQuantity = 0;
        let newQuantity = 0;

        if (matchedColor) {
            previousQuantity = matchedColor.stockQuantity || 0;
            newQuantity = previousQuantity + quantity;
            if (newQuantity < 0) {
                return res.status(400).json({ message: 'Stock cannot be negative' });
            }
            matchedColor.stockQuantity = newQuantity;
        } else {
            previousQuantity = product.stockQuantity || 0;
            newQuantity = previousQuantity + quantity;
            if (newQuantity < 0) {
                return res.status(400).json({ message: 'Stock cannot be negative' });
            }
            product.stockQuantity = newQuantity;
        }

        product.lastStockUpdate = new Date();
        const totalStock = (product.colors || []).reduce((sum, c) => sum + (c.stockQuantity || 0), 0) + (product.stockQuantity || 0);
        if (totalStock === 0) {
            product.in_stock = false;
        } else if (totalStock > 0 && product.in_stock === false) {
            product.in_stock = true;
        }
        await product.save();

        const actor = req.user;
        const log = await StockLog.create({
            productId: product._id,
            productName: product.name,
            changeType,
            quantityChange: quantity,
            previousQuantity,
            newQuantity,
            referenceId: null,
            referenceType: 'Manual',
            performedBy: actor.id || actor._id,
            performedByName: `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email,
            notes: notes || reason || `Manual stock adjustment${matchedColor ? ` (Color: ${matchedColor.name})` : ''}`
        });

        const populatedLog = await StockLog.findById(log._id)
            .populate('performedBy', 'firstName lastName email role');

        res.json({ product, log: populatedLog });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET stock report by date range
exports.getReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const [movementsByType, movementsByProduct] = await Promise.all([
            StockLog.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$changeType',
                        totalIn: {
                            $sum: { $cond: [{ $gt: ['$quantityChange', 0] }, '$quantityChange', 0] }
                        },
                        totalOut: {
                            $sum: { $cond: [{ $lt: ['$quantityChange', 0] }, '$quantityChange', 0] }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            StockLog.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$productId',
                        productName: { $first: '$productName' },
                        totalIn: {
                            $sum: { $cond: [{ $gt: ['$quantityChange', 0] }, '$quantityChange', 0] }
                        },
                        totalOut: {
                            $sum: { $cond: [{ $lt: ['$quantityChange', 0] }, '$quantityChange', 0] }
                        },
                        movements: { $sum: 1 }
                    }
                },
                { $sort: { movements: -1 } },
                { $limit: 20 }
            ])
        ]);

        res.json({
            movementsByType: movementsByType.map(m => ({
                type: m._id || 'Unknown',
                totalIn: m.totalIn,
                totalOut: m.totalOut,
                count: m.count
            })),
            topProducts: movementsByProduct.map(p => ({
                productId: p._id,
                productName: p.productName,
                totalIn: p.totalIn,
                totalOut: p.totalOut,
                movements: p.movements
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper to create stock log entry
exports.createLog = async ({ productId, productName, changeType, quantityChange, referenceId, referenceType, performedBy, performedByName, notes = '' }) => {
    const product = await Product.findById(productId);
    if (!product) return null;

    const previousQuantity = product.stockQuantity || 0;
    const newQuantity = previousQuantity + quantityChange;

    if (newQuantity < 0) return null;

    product.stockQuantity = newQuantity;
    product.lastStockUpdate = new Date();
    if (newQuantity === 0) {
        product.in_stock = false;
    } else if (newQuantity > 0 && product.in_stock === false) {
        product.in_stock = true;
    }
    await product.save();

    const log = await StockLog.create({
        productId,
        productName,
        changeType,
        quantityChange,
        previousQuantity,
        newQuantity,
        referenceId,
        referenceType,
        performedBy,
        performedByName,
        notes
    });

    return log;
};
