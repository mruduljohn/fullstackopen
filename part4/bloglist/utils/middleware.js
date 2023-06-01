const errorHandler = (error, request, response, next) => {
    console.error('Error:', error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'Malformatted id' });
    }
  
    next(error);
  };
  
  module.exports = {
    errorHandler
  };
  