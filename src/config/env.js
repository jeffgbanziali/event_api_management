const dotenv = require('dotenv');

dotenv.config(); // charge les variables du fichier .env

const env = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://Jeffflaj:Koukouda16@jeff.0lid4ok.mongodb.net/event_database',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
};

module.exports = env;

