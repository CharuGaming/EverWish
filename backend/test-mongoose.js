require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const db = mongoose.connection.useDb('celebrationDB');
  const collection = db.collection('admins');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const result = await collection.updateOne(
    { email: 'everwishlk@gmail.com' },
    { $set: { password: hashedPassword } }
  );
  console.log('Update result:', result);
  process.exit(0);
}

check();
