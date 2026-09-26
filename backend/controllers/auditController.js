const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

// GET all audit logs with filters and pagination
exports.getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.action) filter.action = req.query.action;
        if (req.query.entityType) filter.entityType = req.query.entityType;
        if (req.query.entityId) filter.entityId = req.query.entityId;
        if (req.query.adminId) filter.adminId = new mongoose.Types.ObjectId(req.query.adminId);
        if (req.query.search) {
            filter.$or = [
                { description: { $regex: req.query.search, $options: 'i' } },
                { entityName: { $regex: req.query.search, $options: 'i' } },
                { adminName: { $regex: req.query.search, $options: 'i' } },
                { entityId: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
        }

        const [total, logs] = await Promise.all([
            AuditLog.countDocuments(filter),
            AuditLog.find(filter)
                .populate('adminId', 'firstName lastName email')
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

// GET audit stats
exports.getStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalLogs, todayLogs, actionBreakdown, entityBreakdown, topAdmins] = await Promise.all([
            AuditLog.countDocuments(),
            AuditLog.countDocuments({ createdAt: { $gte: today } }),
            AuditLog.aggregate([
                { $group: { _id: '$action', count: { $sum: 1 } } }
            ]),
            AuditLog.aggregate([
                { $group: { _id: '$entityType', count: { $sum: 1 } } }
            ]),
            AuditLog.aggregate([
                { $group: { _id: '$adminId', count: { $sum: 1 }, name: { $first: '$adminName' } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        res.json({
            totalLogs,
            todayLogs,
            actionBreakdown,
            entityBreakdown,
            topAdmins
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET audit logs for a specific entity
exports.getByEntity = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const logs = await AuditLog.find({ entityType, entityId })
            .populate('adminId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
