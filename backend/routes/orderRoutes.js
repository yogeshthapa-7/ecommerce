const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    getOrdersByUser,
    createOrder,
    updateOrder,
    deleteOrder,
    getStats
} = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');

// Public/Admin routes
router.get('/stats', getStats);

// User can see their own orders
router.get('/user/:userId', auth, getOrdersByUser);

// Public readable
router.get('/', getOrders);
router.get('/:id', getOrder);

// Protected routes
router.post('/', auth, audit('Order'), createOrder);
router.put('/:id', auth, adminAuth, audit('Order'), updateOrder);
router.delete('/:id', auth, audit('Order'), deleteOrder);

module.exports = router;
