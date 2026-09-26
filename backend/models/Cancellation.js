const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
    cancellationId: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Requested', 'Approved', 'Rejected'],
        default: 'Requested'
    },
    resolution: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Cancellation', cancellationSchema);
