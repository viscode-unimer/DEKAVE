const express = require('express');
const router = express.Router();
const {
  getCamavisSettings,
  updateCamavisSettings,
  submitCamavis,
  getCamavisList,
  getCamavisById,
  updateCamavisStatus,
  deleteCamavis,
} = require('../controllers/camavisController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Settings routes (public GET, admin-only PUT)
router.get('/settings', getCamavisSettings);
router.put('/settings', protect, adminOnly, updateCamavisSettings);

// Applicant submission (public)
router.post('/', submitCamavis);

// Admin-only management
router.get('/', protect, adminOnly, getCamavisList);
router.get('/:id', protect, adminOnly, getCamavisById);
router.patch('/:id/status', protect, adminOnly, updateCamavisStatus);
router.delete('/:id', protect, adminOnly, deleteCamavis);

module.exports = router;
