require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');

// ── Import route modules ──────────────────────────────────────────
const siteRoutes       = require('./routes/siteRoutes');
const uploadRoutes     = require('./routes/uploadRoutes');
const storefrontRoutes = require('./routes/storefrontRoutes');
const cronRoutes       = require('./routes/cronRoutes');

// ── Initialise Express ─────────────────────────────────────────────
const app    = express();
const PORT   = process.env.PORT || 5001;


// ── Middleware ────────────────────────────────────────────────────

// CORS — allow the Vite dev server and (later) your production domain
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174',  // Vite preview port
  ],
  methods:     ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Parse incoming JSON request bodies (up to 5 MB for large data payloads)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:   'OK',
    service:  'Celebration SaaS API',
    time:     new Date().toISOString(),
    mongo:    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Mount Routes ──────────────────────────────────────────────────
app.use('/api/sites',      siteRoutes);
app.use('/api/upload',     uploadRoutes);
app.use('/api/storefront', storefrontRoutes);
app.use('/api/cron',       cronRoutes);

// ── Global 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ── Connect to MongoDB, then start server ─────────────────────────
const fs = require('fs');
const path = require('path');
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join('/tmp', 'db.json') 
  : path.join(__dirname, 'db.json');

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ sites: [], storefront: null }));
  }
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return Array.isArray(data) ? { sites: data, storefront: null } : data;
  } catch (e) {
    return { sites: [], storefront: null };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function enableJsonFallback() {
  console.log('⚠️  Using local JSON database fallback (backend/db.json) instead of MongoDB Atlas.');
  const Site = require('./models/Site');
  
  Site.findOne = async function(query) {
    const db = readDb();
    const siteId = query.siteId.toLowerCase();
    const site = db.sites.find(s => s.siteId.toLowerCase() === siteId);
    return site || null;
  };
  
  Site.findOneAndUpdate = async function(query, payload, options) {
    const db = readDb();
    const siteId = query.siteId.toLowerCase();
    let index = db.sites.findIndex(s => s.siteId.toLowerCase() === siteId);
    let site = index !== -1 ? db.sites[index] : null;

    if (!site) {
      if (options && options.upsert) {
        site = { siteId, createdAt: new Date().toISOString() };
        db.sites.push(site);
        index = db.sites.length - 1;
      } else {
        return null;
      }
    }
    
    // Perform merge
    Object.assign(site, payload);
    site.updatedAt = new Date().toISOString();
    writeDb(db);
    return site;
  };
  
  Site.find = function(query, projection) {
    return {
      sort: function(sortQuery) {
        const db = readDb();
        let results = db.sites.map(s => ({
          siteId: s.siteId,
          general: s.general || {},
          updatedAt: s.updatedAt || s.createdAt,
          isActive: s.isActive !== false,
          expiresAt: s.expiresAt
        }));
        results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return results;
      }
    };
  };
  
  Site.findOneAndDelete = async function(query) {
    const db = readDb();
    const siteId = query.siteId.toLowerCase();
    const index = db.sites.findIndex(s => s.siteId.toLowerCase() === siteId);
    if (index === -1) return null;
    const deleted = db.sites.splice(index, 1)[0];
    writeDb(db);
    return deleted;
  };
}

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅  MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    enableJsonFallback();
    startServer();
  });

function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
      console.log(`📦  Health:  http://localhost:${PORT}/health`);
      console.log(`🗄️   Sites:   http://localhost:${PORT}/api/sites`);
      console.log(`📁  Upload:  http://localhost:${PORT}/api/upload`);
    });
  } else {
    console.log('🚀 Running in production environment (serverless).');
  }
}

module.exports = app;
