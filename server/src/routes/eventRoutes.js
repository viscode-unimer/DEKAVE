const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, adminOnly, upload.single('poster'), createEvent);
router.put('/:id', protect, adminOnly, upload.single('poster'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
