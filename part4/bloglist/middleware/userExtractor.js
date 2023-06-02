// middleware/userExtractor.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Attach the user to the request object
    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userExtractor;
