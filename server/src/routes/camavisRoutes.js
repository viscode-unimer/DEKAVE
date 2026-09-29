const express = require('express');
const router = express.Router();
const { submitCamavis, getCamavisList, getCamavisById, updateCamavisStatus, deleteCamavis } = require('../controllers/camavisController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitCamavis);
router.get('/', protect, adminOnly, getCamavisList);
router.get('/:id', protect, adminOnly, getCamavisById);
router.patch('/:id/status', protect, adminOnly, updateCamavisStatus);
router.delete('/:id', protect, adminOnly, deleteCamavis);

module.exports = router;
