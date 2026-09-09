const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET sales report grouped by period
exports.getReport = async (req, res) => {
    try {
        const { period = 'daily', startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        let groupFormat = {};
        let sortFormat = {};

        switch (period) {
            case 'weekly':
                groupFormat = {
                    year: { $year: '$createdAt' },
                    week: { $isoWeek: '$createdAt' },
                };
                sortFormat = { year: 1, week: 1 };
                break;
            case 'monthly':
                groupFormat = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                };
                sortFormat = { year: 1, month: 1 };
                break;
            case 'yearly':
                groupFormat = { year: { $year: '$createdAt' } };
                sortFormat = { year: 1 };
                break;
            case 'daily':
            default:
                groupFormat = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                };
                sortFormat = { year: 1, month: 1, day: 1 };
                break;
        }

        const [report, totals] = await Promise.all([
            Order.aggregate([
                { $match: matchStage },
                { $group: {
                    _id: groupFormat,
                    revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$total', 0] } },
                    orders: { $sum: 1 },
                    paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] } },
                    pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] } },
                    cancelledOrders: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'Cancelled'] }, 1, 0] } },
                    avgOrderValue: { $avg: '$total' },
                }},
                { $sort: sortFormat },
                { $limit: period === 'daily' ? 30 : period === 'weekly' ? 12 : period === 'monthly' ? 12 : 5 }
            ]),
            Order.aggregate([
                { $match: matchStage },
                { $group: {
                    _id: null,
                    totalRevenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$total', 0] } },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: '$total' },
                }},
            ])
        ]);

        const total = totals[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

        res.json({
            period,
            report: report.map(r => ({
                label: formatPeriodLabel(r._id, period),
                revenue: r.revenue,
                orders: r.orders,
                paidOrders: r.paidOrders,
                pendingOrders: r.pendingOrders,
                cancelledOrders: r.cancelledOrders,
                avgOrderValue: Math.round(r.avgOrderValue || 0),
            })),
            totals: {
                totalRevenue: total.totalRevenue,
                totalOrders: total.totalOrders,
                avgOrderValue: Math.round(total.avgOrderValue || 0),
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET top products by revenue or quantity
exports.getTopProducts = async (req, res) => {
    try {
        const { limit = 10, sortBy = 'revenue' } = req.query;
        const limitNum = parseInt(limit);

        const pipeline = [
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    image: { $first: '$items.image' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                }
            },
            { $sort: sortBy === 'quantity' ? { totalQuantity: -1 } : { totalRevenue: -1 } },
            { $limit: limitNum },
        ];

        const products = await Order.aggregate(pipeline);
        console.log('top-products aggregation result:', JSON.stringify(products).slice(0, 200));

        const validObjectIds = [];
        const unmatchedNames = [];

        products.forEach((p) => {
            const rawId = p._id;
            if (!rawId) return;
            const stringId = String(rawId);
            if (mongoose.Types.ObjectId.isValid(stringId)) {
                validObjectIds.push(new mongoose.Types.ObjectId(stringId));
            } else if (p.name && !unmatchedNames.includes(p.name)) {
                unmatchedNames.push(p.name);
            }
        });

        console.log('top-products validObjectIds:', validObjectIds.length, 'unmatchedNames:', unmatchedNames);

        const productMap = new Map();
        if (validObjectIds.length > 0) {
            const productDocs = await Product.find({ _id: { $in: validObjectIds } }).select('name category price image_url').lean();
            console.log('top-products productDocs found:', productDocs.length);
            productDocs.forEach(doc => productMap.set(doc._id.toString(), doc));
        }

        const nameMatchMap = new Map();
        if (unmatchedNames.length > 0) {
            const nameDocs = await Product.find({ name: { $in: unmatchedNames } }).select('name category price image_url').lean();
            console.log('top-products nameDocs found:', nameDocs.length);
            nameDocs.forEach(doc => nameMatchMap.set(doc.name, doc));
        }

        const result = products.map(p => {
            const stringId = String(p._id);
            const byId = productMap.get(stringId);
            const byName = !byId && p.name ? nameMatchMap.get(p.name) : undefined;
            const doc = byId || byName;

            return {
                productId: p._id,
                name: p.name || doc?.name || 'Unknown',
                image: p.image || doc?.image_url || '',
                category: doc?.category || '—',
                totalQuantity: p.totalQuantity,
                totalRevenue: p.totalRevenue,
                price: doc?.price || 0,
            };
        });

        res.json(result);
    } catch (error) {
        console.error('getTopProducts error:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET category-wise breakdown
exports.getByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const orders = await Order.find(matchStage).lean();

        const allProductIds = new Set();
        const allProductNames = new Set();
        for (const order of orders) {
            for (const item of order.items || []) {
                if (!item.productId) continue;
                const stringId = String(item.productId);
                if (mongoose.Types.ObjectId.isValid(stringId)) {
                    allProductIds.add(stringId);
                } else if (item.name) {
                    allProductNames.add(item.name);
                }
            }
        }

        const productMap = new Map();
        if (allProductIds.size > 0) {
            const objectIds = Array.from(allProductIds).map(id => new mongoose.Types.ObjectId(id));
            const productDocs = await Product.find({ _id: { $in: objectIds } }).select('category').lean();
            productDocs.forEach(doc => productMap.set(doc._id.toString(), { category: doc.category }));
        }

        const nameCategoryMap = new Map();
        if (allProductNames.size > 0) {
            const nameDocs = await Product.find({ name: { $in: Array.from(allProductNames) } }).select('name category').lean();
            nameDocs.forEach(doc => nameCategoryMap.set(doc.name, doc.category));
        }

        const categoryMap = new Map();

        for (const order of orders) {
            for (const item of order.items || []) {
                if (!item.productId) continue;
                const stringId = String(item.productId);
                const productInfo = productMap.get(stringId);
                let categoryName = productInfo?.category;

                if (!categoryName && item.name) {
                    categoryName = nameCategoryMap.get(item.name) || 'Uncategorized';
                } else if (!categoryName) {
                    categoryName = 'Uncategorized';
                }

                if (!categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, { revenue: 0, orderCount: 0, quantity: 0 });
                }
                const entry = categoryMap.get(categoryName);
                entry.revenue += (item.price || 0) * (item.quantity || 0);
                entry.quantity += (item.quantity || 0);
                entry.orderCount += 1;
            }
        }

        const totalRevenue = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.revenue, 0);
        const categories = Array.from(categoryMap.entries())
            .map(([name, data]) => ({
                name,
                revenue: data.revenue,
                orderCount: data.orderCount,
                quantity: data.quantity,
                percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
            }))
            .sort((a, b) => b.revenue - a.revenue);

        res.json({ categories, totalRevenue });
    } catch (error) {
        console.error('getByCategory error:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET payment method breakdown
exports.getByPaymentMethod = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const [paymentData, total] = await Promise.all([
            Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$paymentMethod',
                        count: { $sum: 1 },
                        revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$total', 0] } },
                    }
                },
                { $sort: { revenue: -1 } },
            ]),
            Order.aggregate([
                { $match: matchStage },
                { $group: {
                    _id: null,
                    total: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$total', 0] } }
                }}
            ])
        ]);

        const totalRevenue = total[0]?.total || 0;

        res.json({
            methods: paymentData.map(p => ({
                method: p._id || 'Unknown',
                count: p.count,
                revenue: p.revenue,
                percentage: totalRevenue > 0 ? Math.round((p.revenue / totalRevenue) * 100) : 0,
            })),
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET order status breakdown
exports.getStatusBreakdown = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const [deliveryStatus, paymentStatus] = await Promise.all([
            Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$deliveryStatus',
                        count: { $sum: 1 },
                        revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$total', 0] } },
                    }
                },
                { $sort: { count: -1 } },
            ]),
            Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$paymentStatus',
                        count: { $sum: 1 },
                        revenue: { $sum: '$total' },
                    }
                },
                { $sort: { count: -1 } },
            ]),
        ]);

        res.json({
            deliveryStatus: deliveryStatus.map(d => ({
                status: d._id || 'Unknown',
                count: d.count,
                revenue: d.revenue,
            })),
            paymentStatus: paymentStatus.map(p => ({
                status: p._id || 'Unknown',
                count: p.count,
                revenue: p.revenue,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET customer insights
exports.getCustomerInsights = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const limitNum = parseInt(limit);

        const [topCustomers, newVsReturning] = await Promise.all([
            Customer.find({ status: 'Active' })
                .sort({ totalSpent: -1 })
                .limit(limitNum)
                .select('name email orders totalSpent'),
            Order.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        orderCount: { $sum: 1 },
                    }
                },
                {
                    $group: {
                        _id: '$orderCount',
                        customers: { $sum: 1 },
                    }
                },
                { $sort: { _id: 1 } },
            ])
        ]);

        const newCustomers = newVsReturning.find(c => c._id === 1)?.customers || 0;
        const returningCustomers = newVsReturning.filter(c => c._id > 1).reduce((sum, c) => sum + c.customers, 0);

        res.json({
            topCustomers: topCustomers.map(c => ({
                name: c.name,
                email: c.email,
                orders: c.orders,
                totalSpent: c.totalSpent,
            })),
            customerSegments: {
                new: newCustomers,
                returning: returningCustomers,
                total: newCustomers + returningCustomers,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function formatPeriodLabel(_id, period) {
    if (!_id) return 'Unknown';
    if (period === 'yearly') return `${_id.year}`;
    if (period === 'monthly') return `${_id.year}-${String(_id.month).padStart(2, '0')}`;
    if (period === 'weekly') return `${_id.year}-W${String(_id.week).padStart(2, '0')}`;
    return `${_id.year}-${String(_id.month).padStart(2, '0')}-${String(_id.day).padStart(2, '0')}`;
}
