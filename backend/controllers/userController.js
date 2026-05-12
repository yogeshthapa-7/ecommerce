const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// GET user count
exports.getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET all users
exports.getUsers = async (req, res) => {
    try {
        // Find all users and exclude the password field
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET current user (Me)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH update profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, profilePic } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (profilePic) user.profilePic = profilePic;

        await user.save();

        // Return user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const { image, fileName } = req.body;

        if (!image || typeof image !== 'string') {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const match = image.match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,(.+)$/);
        if (!match) {
            return res.status(400).json({ success: false, message: 'Only PNG, JPG, WEBP, or GIF images are allowed' });
        }

        const mimeType = match[1];
        const base64Data = match[2];
        const extension = mimeType.split('/')[1].replace('jpeg', 'jpg');
        const safeBaseName = path
            .basename(fileName || 'profile')
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-z0-9-_]/gi, '-')
            .toLowerCase();

        const uploadDir = path.join(__dirname, '..', 'uploads', 'profile');
        fs.mkdirSync(uploadDir, { recursive: true });

        const storedFileName = `${req.user.id}-${Date.now()}-${safeBaseName || 'profile'}.${extension}`;
        const filePath = path.join(uploadDir, storedFileName);
        const buffer = Buffer.from(base64Data, 'base64');

        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: 'Image must be 5MB or smaller' });
        }

        fs.writeFileSync(filePath, buffer);

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile/${storedFileName}`;
        res.json({ success: true, imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH update password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        user.password = newPassword; // Will be hashed by pre-save hook
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
