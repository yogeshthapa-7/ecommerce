const express = require('express');
const router = express.Router();
const {
    getReport,
    getTopProducts,
    getByCategory,
    getByPaymentMethod,
    getStatusBreakdown,
    getCustomerInsights
} = require('../controllers/salesController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

router.get('/report', auth, adminAuth, getReport);
router.get('/top-products', auth, adminAuth, getTopProducts);
router.get('/by-category', auth, adminAuth, getByCategory);
router.get('/by-payment-method', auth, adminAuth, getByPaymentMethod);
router.get('/status-breakdown', auth, adminAuth, getStatusBreakdown);
router.get('/customer-insights', auth, adminAuth, getCustomerInsights);

module.exports = router;
