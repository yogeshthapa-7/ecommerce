const Product = require('../models/Product');

// GET all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({
            category: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH products
exports.searchProducts = async (req, res) => {
    try {
        const { q, category, gender, minPrice, maxPrice, inStock } = req.query;
        const filter = {};

        if (q) {
            filter.name = { $regex: q, $options: 'i' };
        }
        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (gender) {
            filter.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (inStock !== undefined) {
            filter.in_stock = inStock === 'true';
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
