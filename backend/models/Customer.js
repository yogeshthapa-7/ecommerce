const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    orders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive', 'Banned'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
