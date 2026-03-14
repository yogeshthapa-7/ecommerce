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

router.get('/stats', getStats);
router.get('/user/:userId', getOrdersByUser);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
