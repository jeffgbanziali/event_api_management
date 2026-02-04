const mongoose = require('mongoose');
const env = require('./env');

async function connectToDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
};

