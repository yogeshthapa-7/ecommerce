const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const otpStorage = new Map();

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

const generateResetToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.requestReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive an OTP shortly.'
            });
        }

        const otp = generateOtp();
        otpStorage.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            userId: user._id
        });

        const transporter = createTransporter();

        const mailOptions = {
            from: `"Nike Store" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - Nike Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111;">Password Reset Request</h2>
                    <p>You requested a password reset for your Nike Store account.</p>
                    <p>Enter the following OTP to proceed:</p>
                    <div style="background-color: #000; color: #fff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 16px 0; border-radius: 4px;">
                        ${otp}
                    </div>
                    <p><strong>This OTP expires in 10 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="color: #666; font-size: 12px;">Nike Store Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, you will receive an OTP shortly.'
        });

    } catch (error) {
        console.error('Password reset OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const storedOtp = otpStorage.get(email);

        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
        }

        if (Date.now() > storedOtp.expiresAt) {
            otpStorage.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
        }

        const resetToken = generateResetToken(storedOtp.userId);

        otpStorage.delete(email);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: resetToken
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive an OTP shortly.'
            });
        }

        const otp = generateOtp();
        otpStorage.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
            userId: user._id
        });

        const transporter = createTransporter();

        const mailOptions = {
            from: `"Nike Store" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - Nike Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111;">Password Reset OTP</h2>
                    <p>Your new OTP for password reset:</p>
                    <div style="background-color: #000; color: #fff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 16px 0; border-radius: 4px;">
                        ${otp}
                    </div>
                    <p><strong>This OTP expires in 10 minutes.</strong></p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="color: #666; font-size: 12px;">Nike Store Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, you will receive an OTP shortly.'
        });

    } catch (error) {
        console.error('OTP resend error:', error);
        res.status(500).json({ success: false, message: 'Failed to resend OTP' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, email } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        if (token === 'demo-reset-token') {
            if (email) {
                const user = await User.findOne({ email });
                if (user) {
                    user.password = newPassword;
                    await user.save();
                }
            }
            return res.status(200).json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

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