const express = require('express');
const router = express.Router();
const {
  getPageContent,
  updatePageContent,
  resetPageContent,
} = require('../controllers/pageContentController');
const { protect, superadminOnly } = require('../middleware/authMiddleware');

// Public route to view page content
router.get('/:pageKey', getPageContent);

// Superadmin only routes to update or reset page content
router.put('/:pageKey', protect, superadminOnly, updatePageContent);
router.post('/:pageKey/reset', protect, superadminOnly, resetPageContent);

module.exports = router;
