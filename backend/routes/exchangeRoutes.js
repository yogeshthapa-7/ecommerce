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
const audit = require('../middleware/auditMiddleware');

// Public stats
router.get('/stats', getStats);

// User can view their own exchanges
router.get('/user/:userId', auth, getExchangesByUser);

// Public readable (auth required)
router.get('/', auth, getExchanges);
router.get('/:id', auth, getExchange);

// Create an exchange request (auth required)
router.post('/', auth, audit('Exchange'), createExchange);

// User can update requested items for approved exchange
router.put('/:id/request-items', auth, updateExchangeRequest);

// Admin only mutates
router.put('/:id', auth, adminAuth, audit('Exchange'), updateExchange);
router.delete('/:id', auth, adminAuth, audit('Exchange'), deleteExchange);

module.exports = router;
