const express = require('express');
const router = express.Router();
const {
    getLogs,
    getSummary,
    getLowStock,
    adjustStock,
    getReport
} = require('../controllers/stockController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

router.get('/logs', auth, adminAuth, getLogs);
router.get('/summary', auth, adminAuth, getSummary);
router.get('/low-stock', auth, adminAuth, getLowStock);
router.get('/report', auth, adminAuth, getReport);
router.patch('/product/:productId/adjust', auth, adminAuth, adjustStock);

module.exports = router;
