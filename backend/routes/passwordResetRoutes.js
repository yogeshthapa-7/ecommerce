const express = require('express');
const router = express.Router();
const { requestReset, resetPassword } = require('../controllers/passwordResetController');

// Request password reset - sends email with reset link
router.post('/request', requestReset);

// Reset password with token
router.post('/reset', resetPassword);

module.exports = router;