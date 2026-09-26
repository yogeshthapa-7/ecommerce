const mongoose = require('mongoose');

const exchangeItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    color: { type: String, default: '' },
    size: { type: mongoose.Schema.Types.Mixed, default: '' },
    image: { type: String, default: '' }
}, { _id: false });

const exchangeSchema = new mongoose.Schema({
    exchangeId: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    originalItems: { type: [exchangeItemSchema], required: true },
    requestedItems: { type: [exchangeItemSchema], required: true },
    reason: { type: String, default: '' },
    description: { type: String, default: '' },
    priceDifference: { type: Number, default: 0 },
    allRequestedItemsAvailable: { type: Boolean, default: true },
    unavailableRequestedItems: { type: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        reason: { type: String, default: 'Out of stock' }
    }], default: [] },
    status: {
        type: String,
        enum: ['Requested', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
        default: 'Requested'
    },
    resolution: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    shippingLabelUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Exchange', exchangeSchema);
