const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    products: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Hidden', 'Inactive'], default: 'Active' },
    inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
