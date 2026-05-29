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
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp3|mpeg|wav|ogg|m4a|audio/;
    const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk  = allowed.test(file.mimetype) || file.mimetype.startsWith('audio/');
    if (extOk || mimeOk) return cb(null, true);
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and audio files (mp3, wav, ogg, m4a) are allowed.'));
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

// ─── Multer error handler ─────────────────────────────────────────
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only image') || err.message.includes('Only image files')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: err.message });
});

module.exports = router;
