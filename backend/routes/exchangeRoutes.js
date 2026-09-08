const express = require('express');
const router = express.Router();
const {
    getExchanges,
    getExchange,
    getExchangesByUser,
    createExchange,
    updateExchange,
    updateExchangeRequest,
    deleteExchange,
    getStats
} = require('../controllers/exchangeController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

// Public stats
router.get('/stats', getStats);

// User can view their own exchanges
router.get('/user/:userId', auth, getExchangesByUser);

// Public readable (auth required)
router.get('/', auth, getExchanges);
router.get('/:id', auth, getExchange);

// Create an exchange request (auth required)
router.post('/', auth, createExchange);

// User can update requested items for approved exchange
router.put('/:id/request-items', auth, updateExchangeRequest);

// Admin only mutates
router.put('/:id', auth, adminAuth, updateExchange);
router.delete('/:id', auth, adminAuth, deleteExchange);

module.exports = router;
