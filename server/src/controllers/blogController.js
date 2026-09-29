const Blog = require('../models/Blog');
const { uploadToCloudinary } = require('../config/cloudinary');

const getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, tag } = req.query;
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-content'),
      Blog.countDocuments(filter),
    ]);
    res.json({ success: true, data: blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const getAllBlogsAdmin = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, data: blogs });
  } catch (error) { next(error); }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) { next(error); }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) { next(error); }
};

const createBlog = async (req, res, next) => {
  try {
    let thumbnail = '';
    if (req.file) {
      thumbnail = await uploadToCloudinary(req.file.buffer, 'dekave/blogs');
    }
    const tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    const blog = await Blog.create({ ...req.body, thumbnail, tags });
    res.status(201).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

const updateBlog = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      update.thumbnail = await uploadToCloudinary(req.file.buffer, 'dekave/blogs');
    }
    if (req.body.tags) update.tags = req.body.tags.split(',').map(t => t.trim());
    if (req.body.title) {
      update.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) { next(error); }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getBlogs, getAllBlogsAdmin, getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog };
