const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductsByCategory, createProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

// Public routes - readable by anyone
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - requires authentication
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, adminAuth, deleteProduct);

module.exports = router;
