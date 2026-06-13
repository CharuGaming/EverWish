require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const db = mongoose.connection.useDb('celebrationDB');
  const collection = db.collection('sites');
  
  const sites = await collection.find({}).project({ siteId: 1, templateType: 1, category: 1, heroBackgroundMediaUrl: 1 }).toArray();
  console.log('Sites in DB:', sites);
  process.exit(0);
}

check();
