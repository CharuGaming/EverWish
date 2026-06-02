const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const Site = require('../models/Site');

// ─── Cloudinary configuration (from .env) ────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Robust helper to extract Cloudinary public_id from a full URL
 */
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  
  let pathString = parts[1];
  
  // Remove version if it exists (e.g. v1234567890/)
  if (pathString.match(/^v\d+\//)) {
    pathString = pathString.replace(/^v\d+\//, '');
  }
  
  // Remove file extension
  const publicId = pathString.replace(/\.[^/.]+$/, "");
  return publicId;
}

/**
 * Deep recursive search to find all Cloudinary URLs in a mongoose document
 */
function extractAllCloudinaryUrls(obj, urls = new Set()) {
  if (!obj) return urls;
  if (typeof obj === 'string') {
    if (obj.includes('res.cloudinary.com')) {
      urls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractAllCloudinaryUrls(item, urls));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(val => extractAllCloudinaryUrls(val, urls));
  }
  return urls;
}

// ─── Serverless Cron Clean Up API Endpoint ───────────────────────
router.get('/cleanup', async (req, res) => {
  // Authorization Check
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  console.log('[CRON API] Starting 14-day expiration cleanup job...', new Date().toISOString());
  const report = [];

  try {
    // Find all sites that are active but whose expiration date has passed
    const expiredSites = await Site.find({
      isActive: true,
      expiresAt: { $lt: new Date() },
      isDemoPreview: { $ne: true }
    });

    if (expiredSites.length === 0) {
      console.log('[CRON API] No expired sites to clean up today.');
      return res.status(200).json({ success: true, message: 'No expired sites to clean up today.', report });
    }

    console.log(`[CRON API] Found ${expiredSites.length} expired site(s). Proceeding to cleanup...`);

    for (const site of expiredSites) {
      const siteObject = site.toObject();
      const urlsSet = extractAllCloudinaryUrls(siteObject);
      const urls = Array.from(urlsSet);
      const publicIds = urls.map(getPublicIdFromUrl).filter(Boolean);
      
      let deletedCount = 0;
      let failedCount = 0;

      // Delete all assets from Cloudinary
      if (publicIds.length > 0) {
        const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
        const results = await Promise.allSettled(deletePromises);
        failedCount = results.filter(r => r.status === 'rejected').length;
        deletedCount = results.length - failedCount;
      }

      site.isActive = false;
      await site.save();

      report.push({
        siteId: site.siteId,
        assetsFound: publicIds.length,
        assetsDeleted: deletedCount,
        assetsFailed: failedCount
      });
    }

    console.log('[CRON API] Cleanup job completed successfully.');
    return res.status(200).json({ success: true, message: 'Cleanup job completed successfully.', report });
  } catch (err) {
    console.error('[CRON API] Error during cleanup job:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
