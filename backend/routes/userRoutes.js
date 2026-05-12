const express = require('express');
const router = express.Router();
const { getUsers, getUser, deleteUser, getMe, updateProfile, updatePassword, uploadProfilePicture, getUserCount } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// All routes are prefixed with /api/users
router.get('/', getUsers);
router.get('/count', getUserCount);
router.get('/me', auth, getMe);
router.post('/profile-picture', auth, uploadProfilePicture);
router.patch('/profile', auth, updateProfile);
router.patch('/password', auth, updatePassword);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

module.exports = router;
