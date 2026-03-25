const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

// Generate reset token (expires in 1 hour)
const generateResetToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// POST request password reset
exports.requestReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        // Don't reveal if user exists or not (security)
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link shortly.'
            });
        }

        // Generate reset token
        const resetToken = generateResetToken(user._id);

        // Create reset URL - update this to your production domain
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Send email
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Nike Store" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Nike Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111;">Password Reset Request</h2>
                    <p>You requested a password reset for your Nike Store account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
                    <p>Or copy and paste this link: ${resetUrl}</p>
                    <p><strong>This link expires in 1 hour.</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="color: #666; font-size: 12px;">Nike Store Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link shortly.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
    }
};

// POST reset password with token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Set new password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful. You can now login with your new password.' });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};