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

const parseVideoInfo = (url) => {
  if (!url || typeof url !== 'string') {
    return { videoUrl: '', videoType: 'none', defaultThumbnail: '' };
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return { videoUrl: '', videoType: 'none', defaultThumbnail: '' };
  }

  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      videoUrl: trimmed,
      videoType: 'youtube',
      defaultThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const igMatch = trimmed.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return {
      videoUrl: trimmed,
      videoType: 'instagram',
      defaultThumbnail: '',
    };
  }

  return {
    videoUrl: trimmed,
    videoType: 'other',
    defaultThumbnail: '',
  };
};

const createPortfolio = async (req, res, next) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadManyToCloudinary(req.files, 'dekave/portfolios');
    }

    const videoInfo = parseVideoInfo(req.body.videoUrl);
    // Auto thumbnail if YouTube and user didn't upload custom images
    if (videoInfo.videoType === 'youtube' && images.length === 0 && videoInfo.defaultThumbnail) {
      images = [videoInfo.defaultThumbnail];
    }

    const tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const portfolio = await Portfolio.create({
      ...req.body,
      images,
      tags,
      videoUrl: videoInfo.videoUrl,
      videoType: videoInfo.videoType,
    });
    res.status(201).json({ success: true, data: portfolio });
  } catch (error) { next(error); }
};

const updatePortfolio = async (req, res, next) => {
  try {
    const existing = await Portfolio.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const update = { ...req.body };
    if (req.files && req.files.length > 0) {
      update.images = await uploadManyToCloudinary(req.files, 'dekave/portfolios');
    }

    if (req.body.videoUrl !== undefined) {
      const videoInfo = parseVideoInfo(req.body.videoUrl);
      update.videoUrl = videoInfo.videoUrl;
      update.videoType = videoInfo.videoType;

      // Auto thumbnail if YouTube, no new files uploaded, and current images is empty or was YouTube thumbnail
      if (
        videoInfo.videoType === 'youtube' &&
        (!update.images || update.images.length === 0) &&
        (!existing.images || existing.images.length === 0 || existing.images[0]?.includes('img.youtube.com'))
      ) {
        update.images = [videoInfo.defaultThumbnail];
      }
    }

    if (req.body.tags) {
      update.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
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
