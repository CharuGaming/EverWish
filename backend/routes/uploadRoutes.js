const express      = require('express');
const router       = express.Router();
const multer       = require('multer');
const path         = require('path');
const { Readable } = require('stream');
const cloudinary   = require('cloudinary').v2;

// ─── Cloudinary configuration (from .env) ────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// ─── Multer: keep uploaded file in RAM ───────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max (covers video clips)
  fileFilter: (_req, file, cb) => {
    const isImage = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase()) || file.mimetype.startsWith('image/');
    const isAudio = /mp3|mpeg|wav|ogg|m4a/.test(path.extname(file.originalname).toLowerCase()) || file.mimetype.startsWith('audio/');
    const isVideo = /mp4|webm|mov|avi|mkv/.test(path.extname(file.originalname).toLowerCase()) || file.mimetype.startsWith('video/');
    if (isImage || isAudio || isVideo) return cb(null, true);
    cb(new Error('Only image, audio, and video files are allowed.'));
  },
});

// ─── Convert Buffer → Readable stream for Cloudinary upload ──────
function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// ─────────────────────────────────────────────────────────────────
//  POST /api/upload
//  Accepts a single image, uploads it to Cloudinary,
//  and returns a permanent, CDN-optimised direct URL.
// ─────────────────────────────────────────────────────────────────
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Use field name "image".',
    });
  }

    const isAudio = req.file.mimetype.startsWith('audio/') || 
                    ['.mp3', '.wav', '.ogg', '.m4a'].includes(path.extname(req.file.originalname).toLowerCase());

    const uploadOptions = {
      folder:        'everwish-celebrations',
      resource_type: 'auto',
    };

    if (!isAudio) {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' },
      ];
    }

    try {
      // Wrap Cloudinary's stream-based upload_stream in a Promise
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
      // Pipe the in-memory buffer into the Cloudinary upload stream
      bufferToStream(req.file.buffer).pipe(stream);
    });

    // Respond with the permanent Cloudinary URL
    let optimizedUrl = uploadResult.secure_url;
    if (!isAudio && optimizedUrl.includes('/upload/')) {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    res.status(200).json({
      success:  true,
      message:  'Image uploaded successfully.',
      publicId: uploadResult.public_id,
      url:      optimizedUrl,   // HTTPS CDN URL — optimized with f_auto,q_auto
      width:    uploadResult.width,
      height:   uploadResult.height,
      format:   uploadResult.format,
    });

  } catch (err) {
    console.error('[POST /api/upload] Cloudinary error:', err.message);

    if (err.message.includes('cloud_name') || err.message.includes('api_key')) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env',
      });
    }

    res.status(500).json({ success: false, message: 'Image upload failed.', error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────
//  DELETE /api/upload
//  Accepts a Cloudinary URL and deletes it from Cloudinary
// ─────────────────────────────────────────────────────────────────
router.delete('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes('cloudinary.com')) {
      return res.status(400).json({ success: false, message: 'Valid Cloudinary URL required.' });
    }

    // Extract resource_type
    let resourceType = 'image';
    if (url.includes('/video/upload/')) resourceType = 'video';
    else if (url.includes('/raw/upload/')) resourceType = 'raw';

    // Extract public_id
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid Cloudinary URL format.' });
    }

    let pathParts = parts.slice(uploadIndex + 1);
    // Remove transformations (if any) e.g., f_auto,q_auto or w_1200,c_limit
    if (pathParts[0].includes(',')) pathParts.shift();
    // Remove version (if any) e.g., v1689254848
    if (/^v\d+$/.test(pathParts[0])) pathParts.shift();

    const publicIdWithExt = pathParts.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    
    if (result.result === 'ok') {
      res.status(200).json({ success: true, message: 'Asset deleted successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete asset or asset not found.', details: result });
    }
  } catch (err) {
    console.error('[DELETE /api/upload] error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete asset.', error: err.message });
  }
});

// ─── Multer error handler ─────────────────────────────────────────
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only image') || err.message.includes('Only image files')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: err.message });
});

module.exports = router;
