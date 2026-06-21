require('dotenv').config();
const mongoose = require('mongoose');
const Site = require('./models/Site');

async function restore() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const demoTargets = [
      { siteId: 'binoj-charuka', templateType: 'bday1' },
      { siteId: 'charu', templateType: 'bday5' },
      { siteId: 'sai', templateType: 'bday6' }
    ];

    for (const target of demoTargets) {
      const result = await Site.updateOne(
        { siteId: target.siteId },
        { $set: { isDemoPreview: true } }
      );
      console.log(`Updated ${target.siteId} (template: ${target.templateType}):`, result);
    }
  } catch (err) {
    console.error('Error restoring demo sites:', err);
  } finally {
    await mongoose.disconnect();
  }
}

restore();
