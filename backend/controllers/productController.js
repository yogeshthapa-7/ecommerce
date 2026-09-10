const Product = require('../models/Product');
const { addOrUpdateProductInSearch, removeProductFromSearch } = require('../utils/syncMeilisearch');

// GET product count
exports.getProductCount = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all products
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const showAll = req.query.showAll === 'true';
        const includeOutOfStock = req.query.includeOutOfStock === 'true';

        const filter = showAll
            ? {}
            : includeOutOfStock
                ? { status: 'active' }
                : { status: 'active', in_stock: true };

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
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
        const inStockOnly = req.query.inStock !== 'false';
        const filter = {
            category: { $regex: new RegExp(`^${category}$`, 'i') }
        };

        if (inStockOnly) {
            filter.in_stock = true;
        }

        const products = await Product.find(filter);
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
        await addOrUpdateProductInSearch(saved);
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update product
exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        await addOrUpdateProductInSearch(updated);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await removeProductFromSearch(product._id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH products using Meilisearch
exports.searchProducts = async (req, res) => {
    try {
        const { q, category, gender, minPrice, maxPrice, inStock, limit = 20, offset = 0 } = req.query;

        const filters = [];
        if (category) {
            filters.push(`category = "${category}"`);
        }
        if (gender) {
            filters.push(`gender = "${gender}"`);
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            const min = minPrice !== undefined ? Number(minPrice) : null;
            const max = maxPrice !== undefined ? Number(maxPrice) : null;
            if (min !== null && max !== null) {
                filters.push(`price >= ${min} AND price <= ${max}`);
            } else if (min !== null) {
                filters.push(`price >= ${min}`);
            } else if (max !== null) {
                filters.push(`price <= ${max}`);
            }
        }
        if (inStock !== undefined) {
            filters.push(`in_stock = ${inStock === 'true'}`);
        }

        const { getProductIndex } = require('../config/meilisearch');
        const index = await getProductIndex();

        const searchResult = await index.search(q || '', {
            limit: parseInt(limit),
            offset: parseInt(offset),
            filter: filters.length > 0 ? filters.join(' AND ') : undefined,
            sort: ['createdAt:desc'],
        });

        res.json({
            products: searchResult.hits,
            total: searchResult.totalHits,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
