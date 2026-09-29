const express = require('express');
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getMembers);
router.post('/', protect, adminOnly, upload.single('photo'), createMember);
router.put('/:id', protect, adminOnly, upload.single('photo'), updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;
