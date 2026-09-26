const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'] },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'CANCEL', 'COMPLETE', 'RESTOCK', 'ADJUST_STOCK']
    },
    entityType: {
        type: String,
        required: true,
        enum: ['Order', 'Product', 'Return', 'Exchange', 'Customer', 'Category', 'User', 'Stock']
    },
    entityId: { type: String, required: true },
    entityName: { type: String },
    changes: { type: mongoose.Schema.Types.Mixed },
    description: { type: String },
    ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
