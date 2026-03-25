const Category = require('../models/Category');
const Product = require('../models/Product');

// GET all categories
exports.getCategories = async (req, res) => {
    try {
        // 1. Get all registered categories
        const categories = await Category.find().sort({ name: 1 });

        // 2. Get product counts by category from Product collection
        const productCounts = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Create a mapping for easy lookup
        const countMap = {};
        productCounts.forEach(item => {
            if (item._id) {
                countMap[item._id.toLowerCase()] = {
                    originalName: item._id,
                    count: item.count
                };
            }
        });

        const registeredNames = new Set();
        // 3. Merge counts into registered category objects
        const mergedCategories = categories.map(cat => {
            const catObj = cat.toObject();
            const normalizedName = catObj.name.toLowerCase();
            registeredNames.add(normalizedName);
            catObj.products = countMap[normalizedName]?.count || 0;
            return catObj;
        });

        // 4. Add "Ghost" categories (categories in products but not in registered list)
        Object.keys(countMap).forEach(normName => {
            if (!registeredNames.has(normName)) {
                mergedCategories.push({
                    name: countMap[normName].originalName,
                    products: countMap[normName].count,
                    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500',
                    status: 'Active',
                    isGhost: true
                });
            }
        });

        // 5. User requirement: "only shows the items that are in the products"
        // We filter out categories with 0 products unless a parameter says otherwise
        const onlyWithProducts = req.query.all !== 'true';
        const finalCategories = onlyWithProducts
            ? mergedCategories.filter(cat => cat.products > 0)
            : mergedCategories;

        res.json(finalCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create category
exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const saved = await category.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Check if inStock is being changed
        const oldInStock = category.inStock;
        const newInStock = req.body.inStock;

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // If inStock status changed, update all products in this category
        if (newInStock !== undefined && oldInStock !== newInStock) {
            await Product.updateMany(
                { category: category.name },
                { in_stock: newInStock }
            );
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
