const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductsByCategory, createProduct, updateProduct, deleteProduct, searchProducts, getProductCount } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');
const { syncAllProducts } = require('../utils/syncMeilisearch');

// Public routes - readable by anyone
router.get('/search', searchProducts);
router.get('/count', getProductCount);
router.get('/category/:category', getProductsByCategory);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - requires authentication
router.post('/', auth, adminAuth, audit('Product'), createProduct);
router.put('/:id', auth, adminAuth, audit('Product'), updateProduct);
router.delete('/:id', auth, adminAuth, audit('Product'), deleteProduct);

// Reindex all products into Meilisearch (admin only)
router.post('/reindex', auth, adminAuth, async (req, res) => {
    try {
        const result = await syncAllProducts();
        res.json({ message: 'Products reindexed successfully', ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
