const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect, superadminOnly } = require('../middleware/authMiddleware');

// All user management routes require Superadmin role!
router.use(protect, superadminOnly);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
