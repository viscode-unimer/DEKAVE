const express = require('express');
const router = express.Router();
const { getBlogs, getAllBlogsAdmin, getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getBlogs);
router.get('/admin/all', protect, adminOnly, getAllBlogsAdmin);
router.get('/id/:id', protect, adminOnly, getBlogById);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, adminOnly, upload.single('thumbnail'), createBlog);
router.put('/:id', protect, adminOnly, upload.single('thumbnail'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
