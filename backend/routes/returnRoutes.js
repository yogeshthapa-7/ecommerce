const express = require('express');
const router = express.Router();
const {
    getReturns,
    getReturn,
    getReturnsByUser,
    createReturn,
    updateReturn,
    deleteReturn,
    getStats
} = require('../controllers/returnController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');

// Public stats
router.get('/stats', getStats);

// User can view their own returns
router.get('/user/:userId', auth, getReturnsByUser);

// Public readable
router.get('/', auth, getReturns);
router.get('/:id', auth, getReturn);

// Create a return request (auth required so we tie it to a user)
router.post('/', auth, audit('Return'), createReturn);

// Admin only mutates
router.put('/:id', auth, adminAuth, audit('Return'), updateReturn);
router.delete('/:id', auth, adminAuth, audit('Return'), deleteReturn);

module.exports = router;
