const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');

router.get('/', getCategories);
router.post('/', auth, adminAuth, audit('Category'), createCategory);
router.put('/:id', auth, adminAuth, audit('Category'), updateCategory);
router.delete('/:id', auth, adminAuth, audit('Category'), deleteCategory);

module.exports = router;
