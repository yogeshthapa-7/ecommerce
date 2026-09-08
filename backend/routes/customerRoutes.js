const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    toggleStatus,
    deleteCustomer
} = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const audit = require('../middleware/auditMiddleware');

// Public readable
router.get('/', getCustomers);
router.get('/:id', getCustomer);

// User registration (no auth needed)
router.post('/', createCustomer);

// Protected routes
router.put('/:id', auth, adminAuth, audit('Customer'), updateCustomer);
router.patch('/:id/status', auth, adminAuth, audit('Customer'), toggleStatus);
router.delete('/:id', auth, adminAuth, audit('Customer'), deleteCustomer);

module.exports = router;
