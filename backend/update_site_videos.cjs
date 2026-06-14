const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://binojcharuka5_db_user:BB5VicF1GWXZuQa3@cluster0.a5x10jt.mongodb.net/celebrationDB?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const sitesCollection = db.collection('sites');

    const siteId = 'sanduni-and-sandun';
    const site = await sitesCollection.findOne({ siteId });
    if (!site) {
      console.log(`Site "${siteId}" not found.`);
      return;
    }

    console.log("Found site:", site.siteId);
    console.log("Current polaroid:", site.polaroid);
    console.log("Current modern:", site.modern);

    const update = {
      $set: {
        'polaroid.introVideoUrl': 'https://res.cloudinary.com/daczoccvq/video/upload/v1781418389/everwish-celebrations/ybvuxs67s8y14trciazj.mp4',
        'polaroid.bgVideoUrl': 'https://res.cloudinary.com/daczoccvq/video/upload/v1781415624/everwish-celebrations/cmkifb0eiv8d5yfx1zsk.mp4',
        'modern.introVideoUrl': 'https://res.cloudinary.com/daczoccvq/video/upload/v1781418389/everwish-celebrations/ybvuxs67s8y14trciazj.mp4',
        'modern.bgVideoUrl': 'https://res.cloudinary.com/daczoccvq/video/upload/v1781415624/everwish-celebrations/cmkifb0eiv8d5yfx1zsk.mp4',
      }
    };

    const res = await sitesCollection.updateOne({ siteId }, update);
    console.log("Update result:", res);

    const updatedSite = await sitesCollection.findOne({ siteId });
    console.log("New polaroid:", updatedSite.polaroid);
    console.log("New modern:", updatedSite.modern);

  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
