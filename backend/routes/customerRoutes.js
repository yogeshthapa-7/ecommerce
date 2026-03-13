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

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.patch('/:id/status', toggleStatus);
router.delete('/:id', deleteCustomer);

module.exports = router;
