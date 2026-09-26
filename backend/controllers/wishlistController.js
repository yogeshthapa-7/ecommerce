const Wishlist = require('../models/Wishlist');

// GET wishlist for logged-in user
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.findOne({ userId }).lean();
        res.json({ items: wishlist?.items || [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST add item to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, name, price, currency, image_url, category, gender, in_stock } = req.body;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const exists = wishlist.items.some((item) => item.productId === productId);

        if (!exists) {
            wishlist.items.push({
                productId,
                name: name || 'Product',
                price: Number(price || 0),
                currency: currency || '$',
                image_url: image_url || '',
                category: category || '',
                gender: gender || '',
                in_stock: Boolean(in_stock)
            });
        }

        await wishlist.save();
        res.json({ items: wishlist.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter((item) => item.productId !== productId);
        await wishlist.save();
        res.json({ items: wishlist.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
