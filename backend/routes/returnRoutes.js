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

// Public stats
router.get('/stats', getStats);

// User can view their own returns
router.get('/user/:userId', auth, getReturnsByUser);

// Public readable
router.get('/', auth, getReturns);
router.get('/:id', auth, getReturn);

// Create a return request (auth required so we tie it to a user)
router.post('/', auth, createReturn);

// Admin only mutates
router.put('/:id', auth, adminAuth, updateReturn);
router.delete('/:id', auth, adminAuth, deleteReturn);

module.exports = router;
