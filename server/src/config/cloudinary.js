const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
    }
  },
});

/**
 * Upload a single buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer
 * @param {string} folder  - Cloudinary folder, e.g. 'dekave/portfolios'
 * @returns {Promise<string>} secure_url
 */
const uploadToCloudinary = (buffer, folder = 'dekave') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Upload multiple file buffers (from req.files) to Cloudinary.
 * @param {Express.Multer.File[]} files
 * @param {string} folder
 * @returns {Promise<string[]>} array of secure_urls
 */
const uploadManyToCloudinary = (files, folder = 'dekave') => {
  return Promise.all(files.map((f) => uploadToCloudinary(f.buffer, folder)));
};

module.exports = { cloudinary, upload, uploadToCloudinary, uploadManyToCloudinary };
