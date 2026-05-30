const mongoose = require('mongoose');
try {
  mongoose.connect(undefined).catch(e => console.log('caught by promise catch'));
} catch (e) {
  console.log('caught by sync catch:', e.message);
}
