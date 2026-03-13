const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        size: mongoose.Schema.Types.Mixed,
        image: String
    }],
    total: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Pending'
    },
    deliveryStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    paymentMethod: { type: String, default: 'card' },
    shippingInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
