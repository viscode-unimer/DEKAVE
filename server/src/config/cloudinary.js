const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary only if credentials are set and not placeholder
const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(
    name && !name.includes('your_') &&
    key && !key.includes('your_') &&
    secret && !secret.includes('your_')
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Memory storage for multer
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
 * Determine image extension and mime type from buffer magic numbers
 */
const detectImageType = (buffer) => {
  if (buffer.length >= 4) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return { ext: '.png', mime: 'image/png' };
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return { ext: '.jpg', mime: 'image/jpeg' };
    }
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      return { ext: '.webp', mime: 'image/webp' };
    }
  }
  return { ext: '.jpg', mime: 'image/jpeg' };
};

/**
 * Fallback to local file storage when Cloudinary is not configured or fails
 */
const saveLocally = async (buffer, folder = 'dekave') => {
  const { ext, mime } = detectImageType(buffer);
  const subfolder = folder.replace(/^dekave\/?/, '') || 'general';
  const uploadDir = path.join(__dirname, '../../uploads', subfolder);

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${baseUrl}/uploads/${subfolder}/${filename}`;
  } catch (err) {
    console.warn('Local file write failed, falling back to base64 Data URI:', err.message);
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }
};

/**
 * Upload a single buffer: tries Cloudinary first if configured, else saves locally.
 * @param {Buffer} buffer
 * @param {string} folder  - Cloudinary folder, e.g. 'dekave/members'
 * @returns {Promise<string>} secure_url or local_url
 */
const uploadToCloudinary = (buffer, folder = 'dekave') => {
  if (!isCloudinaryConfigured()) {
    return saveLocally(buffer, folder);
  }

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
      async (error, result) => {
        if (error) {
          console.warn('Cloudinary upload error, falling back to local storage:', error.message);
          try {
            const localUrl = await saveLocally(buffer, folder);
            return resolve(localUrl);
          } catch (localErr) {
            console.error('All upload fallbacks failed:', localErr);
            return resolve('');
          }
        }
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Upload multiple file buffers (from req.files).
 * @param {Express.Multer.File[]} files
 * @param {string} folder
 * @returns {Promise<string[]>} array of URLs
 */
const uploadManyToCloudinary = (files, folder = 'dekave') => {
  return Promise.all(files.map((f) => uploadToCloudinary(f.buffer, folder)));
};

module.exports = { cloudinary, upload, uploadToCloudinary, uploadManyToCloudinary, isCloudinaryConfigured };
