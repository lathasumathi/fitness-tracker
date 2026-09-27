const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
module.exports = router;