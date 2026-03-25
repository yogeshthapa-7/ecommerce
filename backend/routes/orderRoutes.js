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

// Public/Admin routes
router.get('/stats', getStats);

// User can see their own orders
router.get('/user/:userId', auth, getOrdersByUser);

// Public readable
router.get('/', getOrders);
router.get('/:id', getOrder);

// Protected routes
router.post('/', auth, createOrder);
router.put('/:id', auth, adminAuth, updateOrder);
router.delete('/:id', auth, adminAuth, deleteOrder);

module.exports = router;
