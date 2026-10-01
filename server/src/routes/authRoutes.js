const express = require('express');
const router = express.Router();
const { login, registerContributor, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register-contributor', registerContributor);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
