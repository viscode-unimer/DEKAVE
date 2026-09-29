const Portfolio = require('../models/Portfolio');
const { upload, uploadManyToCloudinary } = require('../config/cloudinary');

const getPortfolios = async (req, res, next) => {
  try {
    const { category, featured, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    const skip = (page - 1) * limit;
    const [portfolios, total] = await Promise.all([
      Portfolio.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Portfolio.countDocuments(filter),
    ]);
    res.json({ success: true, data: portfolios, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, data: portfolio });
  } catch (error) { next(error); }
};

const createPortfolio = async (req, res, next) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadManyToCloudinary(req.files, 'dekave/portfolios');
    }
    const tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    const portfolio = await Portfolio.create({ ...req.body, images, tags });
    res.status(201).json({ success: true, data: portfolio });
  } catch (error) { next(error); }
};

const updatePortfolio = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.files && req.files.length > 0) {
      update.images = await uploadManyToCloudinary(req.files, 'dekave/portfolios');
    }
    if (req.body.tags) update.tags = req.body.tags.split(',').map(t => t.trim());
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, data: portfolio });
  } catch (error) { next(error); }
};

const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getPortfolios, getPortfolio, createPortfolio, updatePortfolio, deletePortfolio };
