const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Storefront = require('./models/Storefront');

dotenv.config({ path: '.env' });

const v5 = {
  id: 'v5', name: 'The Cinematic Anniversary', price: 'Rs. 750',
  emoji: '🎬', tag: 'Cinematic',
  category: 'valentine',
  description: 'Video intro, live relationship timer, timeline & custom audio player.',
  gradient: 'from-slate-700 to-rose-800',
  isActive: true
};

const b5 = {
  id: 'b5', name: 'The Cinematic Birthday', price: 'Rs. 750',
  emoji: '🎬', tag: 'Cinematic',
  category: 'birthday',
  description: 'Video intro, gift box reveal, year recap & custom audio player.',
  gradient: 'from-amber-500 to-orange-600',
  isActive: true
};

async function patchMongoose() {
  if (!process.env.MONGODB_URI) {
    console.log("No MongoDB URI, skipping mongoose patch");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const storefront = await Storefront.findOne({ isGlobal: true });
    if (storefront) {
      if (!storefront.templates.find(t => t.id === 'v5')) {
        storefront.templates.push(v5);
        console.log("Added v5 to MongoDB");
      }
      if (!storefront.templates.find(t => t.id === 'b5')) {
        storefront.templates.push(b5);
        console.log("Added b5 to MongoDB");
      }
      await storefront.save();
      console.log("MongoDB patched.");
    }
    await mongoose.disconnect();
  } catch(e) {
    console.error("Mongoose patch failed", e);
  }
}

function patchDbJson() {
  const file = 'backend/db.json';
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data.storefront && data.storefront.templates) {
      let changed = false;
      if (!data.storefront.templates.find(t => t.id === 'v5')) {
        data.storefront.templates.push(v5);
        changed = true;
        console.log("Added v5 to db.json");
      }
      if (!data.storefront.templates.find(t => t.id === 'b5')) {
        data.storefront.templates.push(b5);
        changed = true;
        console.log("Added b5 to db.json");
      }
      if (changed) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log("db.json patched.");
      }
    }
  } else {
    console.log("No db.json found");
  }
}

async function run() {
  patchDbJson();
  await patchMongoose();
}
run();
