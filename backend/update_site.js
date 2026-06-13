require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function enableFeatures() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const db = mongoose.connection.useDb('celebrationDB');
  const collection = db.collection('sites');

  const result = await collection.updateOne(
    { siteId: 'maleesha-fernando' },
    {
      $set: {
        'cinematicBirthday.useInteractiveHero': true,
        'cinematicBirthday.nickname': 'Maleesha',
        'cinematicBirthday.loveLetterContent': 'Dear Maleesha,\n\nEvery moment with you is like a dream. Thank you for being the most amazing person in my life. I love you more than words can express!\n\nForever yours,\nCharu',
        'cinematicBirthday.heroPhotos': [
          'https://res.cloudinary.com/daczoccvq/image/upload/f_auto,q_auto/v1780904273/everwish-celebrations/a0lkpompmpx1ntxr66nk.jpg',
          'https://res.cloudinary.com/daczoccvq/image/upload/f_auto,q_auto/v1780904280/everwish-celebrations/d7tu74aevlmjlpptjran.jpg',
          'https://res.cloudinary.com/daczoccvq/image/upload/f_auto,q_auto/v1780904288/everwish-celebrations/gauxqqdv70jjwjbyot6s.jpg',
          'https://res.cloudinary.com/daczoccvq/image/upload/f_auto,q_auto/v1780904295/everwish-celebrations/cyiywybdxnoh2gbqd1yl.jpg',
          'https://res.cloudinary.com/daczoccvq/image/upload/f_auto,q_auto/v1780904305/everwish-celebrations/xwepo4byz2aef027adnc.jpg'
        ]
      }
    }
  );

  console.log('Update result:', result);
  process.exit(0);
}

enableFeatures();
