require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI
};
const PORT = process.env.PORT || 3000;

module.exports = {
  PORT,
};
