const express = require('express');
const router  = express.Router();
const Site    = require('../models/Site');

// ─────────────────────────────────────────────────────────────────
//  GET /api/sites/:siteId
//  Fetch the full configuration for one client site.
// ─────────────────────────────────────────────────────────────────
router.get('/:siteId', async (req, res) => {
  try {
    const site = await Site.findOne({ siteId: req.params.siteId.toLowerCase() });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: `Site "${req.params.siteId}" not found.`,
      });
    }

    res.status(200).json({ success: true, data: site });
  } catch (err) {
    console.error('[GET /api/sites/:siteId]', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching site.' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  POST /api/sites/:siteId
//  Create or completely overwrite a site configuration.
//  Uses upsert so the Admin Dashboard can call this for both
//  "create new client" and "update existing client".
// ─────────────────────────────────────────────────────────────────
router.post('/:siteId', async (req, res) => {
  try {
    const siteId = req.params.siteId.toLowerCase();

    // Merge siteId into the body so it is always stored correctly
    const payload = { ...req.body, siteId };

    const site = await Site.findOneAndUpdate(
      { siteId },        // filter
      payload,           // replacement document
      {
        upsert:    true,  // create if it doesn't exist
        new:       true,  // return the updated document
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: `Site "${siteId}" saved successfully.`,
      data:    site,
    });
  } catch (err) {
    console.error('[POST /api/sites/:siteId]', err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error saving site.' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  GET /api/sites
//  List all sites (for Admin Dashboard index page)
// ─────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // Projection: only fetch lightweight summary fields — never pull full image arrays/messages
    const sites = await Site
      .find({}, 'siteId general.coupleName createdAt updatedAt isActive expiresAt')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: sites });
  } catch (err) {
    console.error('[GET /api/sites]', err.message);
    res.status(500).json({ success: false, message: 'Server error listing sites.' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  DELETE /api/sites/:siteId
//  Remove a client site (for admin cleanup)
// ─────────────────────────────────────────────────────────────────
router.delete('/:siteId', async (req, res) => {
  try {
    const deleted = await Site.findOneAndDelete({ siteId: req.params.siteId.toLowerCase() });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Site not found.' });
    }

    res.status(200).json({ success: true, message: `Site "${req.params.siteId}" deleted.` });
  } catch (err) {
    console.error('[DELETE /api/sites/:siteId]', err.message);
    res.status(500).json({ success: false, message: 'Server error deleting site.' });
  }
});

module.exports = router;
