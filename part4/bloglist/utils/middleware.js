const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  if (error.message && error.name === 'CastError') {
    console.error('Error:', error.message);
    return response.status(400).send({ error: 'Malformatted id' });
  }

  next(error);
};



const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor
};
