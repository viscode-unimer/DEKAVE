const express = require('express');
const router = express.Router();
const { getPortfolios, getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } = require('../controllers/portfolioController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getPortfolios);
router.get('/:id', getPortfolio);
router.post('/', protect, adminOnly, upload.array('images', 10), createPortfolio);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updatePortfolio);
router.delete('/:id', protect, adminOnly, deletePortfolio);

module.exports = router;
