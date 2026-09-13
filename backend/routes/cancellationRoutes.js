const express = require('express');
const router = express.Router();
const {
    getCancellations,
    getCancellation,
    getCancellationsByUser,
    createCancellation,
    updateCancellation,
    deleteCancellation,
    getStats
} = require('../controllers/cancellationController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');

// Public stats
router.get('/stats', getStats);

// User can view their own cancellations
router.get('/user/:userId', auth, getCancellationsByUser);

// Public readable
router.get('/', auth, getCancellations);
router.get('/:id', auth, getCancellation);

// Create a cancellation request (auth required so we tie it to a user)
router.post('/', auth, audit('Cancellation'), createCancellation);

// Admin only mutates
router.put('/:id', auth, adminAuth, audit('Cancellation'), updateCancellation);
router.delete('/:id', auth, adminAuth, audit('Cancellation'), deleteCancellation);

module.exports = router;
