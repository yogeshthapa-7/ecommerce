const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
