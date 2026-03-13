const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, default: 'Unisex' },
    price: { type: Number, required: true },
    status: { type: String, default: 'active' },
    currency: { type: String, default: '$' },
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    colors: [{
        name: String,
        image_url: String
    }],
    description: { type: String, default: '' },
    image_url: { type: String, default: '' },
    in_stock: { type: Boolean, default: true },
    sizes: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
