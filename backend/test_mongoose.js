const mongoose = require('mongoose');
require('dotenv').config();
const Site = require('./models/Site');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const site = await Site.findOne();
  if(!site) { console.log("No site"); return; }
  
  const siteObj = site.toObject();
  siteObj.general.coupleName = "Test Name " + Date.now();
  
  const payload = { ...siteObj };
  // payload contains _id, createdAt, etc.
  
  try {
    const updated = await Site.findOneAndUpdate(
      { siteId: site.siteId },
      payload,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log("Updated coupleName:", updated.general.coupleName);
  } catch (err) {
    console.log("Error:", err.message);
  }
  process.exit(0);
}
test();
