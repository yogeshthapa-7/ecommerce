const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    color: { type: String, default: '' },
    size: { type: mongoose.Schema.Types.Mixed },
    image: { type: String, default: '' },
    reason: { type: String, default: '' }
}, { _id: false });

const returnSchema = new mongoose.Schema({
    returnId: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [returnItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Requested', 'Approved', 'Rejected', 'Refunded', 'Cancelled'],
        default: 'Requested'
    },
    resolution: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    refundAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
