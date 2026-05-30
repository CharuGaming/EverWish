const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Storefront = require('../models/Storefront');
const fs = require('fs');
const path = require('path');

// Fallback logic for db.json if mongo fails
const dbPath = (process.env.NODE_ENV === 'production' || process.env.VERCEL)
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, '..', 'db.json');

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ sites: [], orders: [], storefront: null }));
  }
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return { sites: data, orders: [], storefront: null };
    }
    return {
      sites: data.sites || [],
      orders: data.orders || [],
      storefront: data.storefront || null
    };
  } catch (e) {
    return { sites: [], orders: [], storefront: null };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Initial Data matching current Storefront.jsx hardcoded values
const INITIAL_STOREFRONT = {
  isGlobal: true,
  templates: [
    {
      id: 'v1', name: 'The Polaroid Love Story', price: 'Rs. 2,500',
      emoji: '📸', tag: 'Bestseller',
      category: 'valentine',
      description: 'Vintage polaroid gallery with a love-letter reveal.',
      gradient: 'from-rose-400 to-pink-500',
    },
    {
      id: 'v2', name: 'The Modern Romance', price: 'Rs. 2,500',
      emoji: '💫', tag: 'Elegant',
      category: 'valentine',
      description: 'Sleek, cinematic design with smooth scroll sections.',
      gradient: 'from-purple-400 to-rose-400',
    },
    {
      id: 'v3', name: 'The Valentine Experience', price: 'Rs. 3,000',
      emoji: '💝', tag: 'Interactive',
      category: 'valentine',
      description: 'Interactive floating hearts, surprise gifts & confetti.',
      gradient: 'from-red-400 to-rose-500',
    },
    {
      id: 'v4', name: 'The Proposal Suite', price: 'Rs. 3,500',
      emoji: '💍', tag: 'Premium',
      category: 'valentine',
      description: 'A full proposal journey — question, countdown & ring reveal.',
      gradient: 'from-rose-500 to-amber-400',
    },
    {
      id: 'b1', name: 'The Unwrapping Experience', price: 'Rs. 2,500',
      emoji: '🎁', tag: 'Fun',
      category: 'birthday',
      description: 'Tap to unwrap a digital birthday gift box with wishes inside.',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'b2', name: 'The Balloon Pop', price: 'Rs. 2,500',
      emoji: '🎈', tag: 'Playful',
      category: 'birthday',
      description: 'Pop colourful balloons to reveal personalised messages.',
      gradient: 'from-sky-400 to-violet-500',
    },
    {
      id: 'b3', name: 'The Card Flip', price: 'Rs. 2,500',
      emoji: '🃏', tag: 'Classic',
      category: 'birthday',
      description: 'Elegant flip-card gallery with a heartfelt birthday note.',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'b4', name: 'The Surprise Party', price: 'Rs. 3,000',
      emoji: '🎉', tag: 'Immersive',
      category: 'birthday',
      description: 'Full party experience with confetti, music & a wishes wall.',
      gradient: 'from-fuchsia-400 to-pink-500',
    },
  ],
  testimonials: [
    {
      name: 'Maleesha R.',
      avatar: '👩',
      rating: 5,
      text: 'I gifted my boyfriend the Proposal Suite and he was absolutely speechless! Every detail was perfect. EverWish made it magical.',
      templateName: 'Proposal Suite',
      screenshotUrl: ''
    },
    {
      name: 'Kavindu S.',
      avatar: '👨',
      rating: 5,
      text: 'The Balloon Pop birthday page for my best friend had everyone at the party screaming with joy. Worth every rupee!',
      templateName: 'Balloon Pop',
      screenshotUrl: ''
    },
    {
      name: 'Anuki P.',
      avatar: '👩‍🦱',
      rating: 5,
      text: 'Setup was so fast and the support was amazing. My partner cried happy tears — mission accomplished 😭❤️',
      templateName: 'Polaroid Love Story',
      screenshotUrl: ''
    },
    {
      name: 'Tharindu M.',
      avatar: '🧑',
      rating: 5,
      text: 'A completely unique gift idea. I\'ve used EverWish twice now and will definitely keep coming back for every occasion!',
      templateName: 'The Unwrapping',
      screenshotUrl: ''
    },
  ]
};

// GET /api/storefront
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let storefront = await Storefront.findOne({ isGlobal: true });
      if (!storefront) {
        storefront = await Storefront.create(INITIAL_STOREFRONT);
      }
      return res.json({ success: true, data: storefront });
    } else {
      // Use fallback
      const data = readDb();
      if (!data.storefront) {
        data.storefront = INITIAL_STOREFRONT;
        writeDb(data);
      }
      return res.json({ success: true, data: data.storefront });
    }
  } catch (error) {
    console.error('Storefront GET error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/storefront
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    
    if (mongoose.connection.readyState === 1) {
      let storefront = await Storefront.findOne({ isGlobal: true });
      if (!storefront) {
        storefront = new Storefront({ isGlobal: true, ...payload });
        await storefront.save();
      } else {
        storefront.templates = payload.templates || [];
        storefront.testimonials = payload.testimonials || [];
        await storefront.save();
      }
      
      if (req.app.get('io')) {
        req.app.get('io').emit('storefrontUpdated', storefront);
      }
      
      return res.json({ success: true, data: storefront });
    } else {
      // Use fallback
      const data = readDb();
      data.storefront = { ...INITIAL_STOREFRONT, ...payload, isGlobal: true };
      writeDb(data);
      
      if (req.app.get('io')) {
        req.app.get('io').emit('storefrontUpdated', data.storefront);
      }
      
      return res.json({ success: true, data: data.storefront });
    }
  } catch (error) {
    console.error('Storefront POST error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
