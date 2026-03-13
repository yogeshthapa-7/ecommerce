const express = require('express');
const router = express.Router();
const { getUsers, getUser, deleteUser, getMe, updateProfile, updatePassword } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// All routes are prefixed with /api/users
router.get('/', getUsers);
router.get('/me', auth, getMe);
router.patch('/profile', auth, updateProfile);
router.patch('/password', auth, updatePassword);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

module.exports = router;
