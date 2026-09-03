const express = require('express');
const router = express.Router();
const { requestReset, verifyOtp, resendOtp, resetPassword } = require('../controllers/passwordResetController');

// Request password reset OTP - sends OTP to email
router.post('/request', requestReset);

// Verify OTP and return reset token
router.post('/verify-otp', verifyOtp);

// Resend OTP
router.post('/resend-otp', resendOtp);

// Reset password with verified token
router.post('/reset', resetPassword);

module.exports = router;