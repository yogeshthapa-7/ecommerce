const Return = require('../models/Return');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// GET all returns (admin, paginated)
exports.getReturns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [total, returns] = await Promise.all([
            Return.countDocuments(filter),
            Return.find(filter)
                .populate('orderId', 'orderId total customer customerEmail date')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        res.json({
            returns,
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

// GET returns for a specific user
exports.getReturnsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let returns = [];

        if (mongoose.Types.ObjectId.isValid(userId)) {
            returns = await Return.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('orderId', 'orderId total')
                .sort({ createdAt: -1 });
        }

        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single return
exports.getReturn = async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id)
            .populate('orderId', 'orderId total customer customerEmail date items')
            .populate('userId', 'firstName lastName email');
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create return request
exports.createReturn = async (req, res) => {
    try {
        const { orderId, items, totalAmount, reason, customerName, customerEmail, userId } = req.body;

        if (!orderId || !items || !reason) {
            return res.status(400).json({ message: 'Order id, items, and reason are required' });
        }

        // Validate the referenced order exists
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.deliveryStatus !== 'Delivered') {
            return res.status(400).json({ message: 'Returns are only allowed for delivered orders' });
        }

        const returnId = `RET-${Date.now().toString().slice(-6)}`;

        const ret = new Return({
            returnId,
            orderId,
            userId: userId || order.userId || null,
            customerName: customerName || order.customer || '',
            customerEmail: customerEmail || order.customerEmail || '',
            items,
            totalAmount: totalAmount || 0,
            reason,
            description: req.body.description || '',
            status: 'Requested'
        });

        const saved = await ret.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update return status (admin action)
exports.updateReturn = async (req, res) => {
    try {
        const { status, resolution, refundAmount } = req.body;

        const update = {};
        if (status) update.status = status;
        if (resolution !== undefined) update.resolution = resolution;
        if (refundAmount !== undefined) update.refundAmount = refundAmount;

        if (status && ['Approved', 'Rejected', 'Refunded', 'Cancelled'].includes(status)) {
            update.resolvedBy = req.user?.id || req.user?._id;
            update.resolvedAt = new Date();
        }

        const ret = await Return.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!ret) return res.status(404).json({ message: 'Return not found' });
        res.json(ret);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE return
exports.deleteReturn = async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });

        const isAllowed = ret.status === 'Requested' || req.user?.role === 'admin';
        if (!isAllowed) {
            return res.status(400).json({ message: 'Cannot delete a return that is already resolved' });
        }

        await ret.deleteOne();
        res.json({ message: 'Return deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET dashboard stats for returns
exports.getStats = async (req, res) => {
    try {
        const [totalRequests, approved, rejected, refunded, totalRefundAmount] = await Promise.all([
            Return.countDocuments({ status: 'Requested' }),
            Return.countDocuments({ status: 'Approved' }),
            Return.countDocuments({ status: 'Rejected' }),
            Return.countDocuments({ status: 'Refunded' }),
            Return.aggregate([
                { $match: { status: 'Refunded' } },
                { $group: { _id: null, total: { $sum: '$refundAmount' } } }
            ])
        ]);

        const refundTotal = totalRefundAmount[0]?.total || 0;

        res.json({
            totalRequests,
            approved,
            rejected,
            refunded,
            refundTotal
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
