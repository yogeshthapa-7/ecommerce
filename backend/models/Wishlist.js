const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: '$' },
    image_url: { type: String, default: '' },
    category: { type: String, default: '' },
    gender: { type: String, default: '' },
    in_stock: { type: Boolean, default: false }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    items: [wishlistItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
