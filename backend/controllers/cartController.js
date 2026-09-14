const Cart = require('../models/Cart');

// GET cart for logged-in user
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).lean();
        res.json({ items: cart?.items || [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, name, price, quantity, color, size, image, currency, category } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const cartItemId = `${productId}-${color || 'default'}-${size || 'default'}`;
        const existingIndex = cart.items.findIndex(
            (item) => `${item.productId}-${item.color || 'default'}-${item.size || 'default'}` === cartItemId
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += Number(quantity || 1);
        } else {
            cart.items.push({
                productId,
                name,
                price: Number(price || 0),
                quantity: Number(quantity || 1),
                color: color || 'Default',
                size: size || '',
                image: image || '',
                currency: currency || '$',
                category: category || ''
            });
        }

        await cart.save();
        res.json({ items: cart.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST update item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color, size, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemId = `${productId}-${color || 'default'}-${size || 'default'}`;
        const existingIndex = cart.items.findIndex(
            (item) => `${item.productId}-${item.color || 'default'}-${item.size || 'default'}` === cartItemId
        );

        if (existingIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(existingIndex, 1);
        } else {
            cart.items[existingIndex].quantity = Number(quantity);
        }

        await cart.save();
        res.json({ items: cart.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color, size } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemId = `${productId}-${color || 'default'}-${size || 'default'}`;
        cart.items = cart.items.filter(
            (item) => `${item.productId}-${item.color || 'default'}-${item.size || 'default'}` !== cartItemId
        );

        await cart.save();
        res.json({ items: cart.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST sync local cart items to backend (merge)
exports.syncCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        if (Array.isArray(items)) {
            items.forEach((item) => {
                const cartItemId = `${item.productId}-${item.color || 'default'}-${item.size || 'default'}`;
                const existingIndex = cart.items.findIndex(
                    (ci) => `${ci.productId}-${ci.color || 'default'}-${ci.size || 'default'}` === cartItemId
                );
                if (existingIndex > -1) {
                    cart.items[existingIndex].quantity += Number(item.quantity || 1);
                } else {
                    cart.items.push({
                        productId: item.productId,
                        name: item.name,
                        price: Number(item.price || 0),
                        quantity: Number(item.quantity || 1),
                        color: item.color || 'Default',
                        size: item.size || '',
                        image: item.image || '',
                        currency: item.currency || '$',
                        category: item.category || ''
                    });
                }
            });
        }

        await cart.save();
        res.json({ items: cart.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
