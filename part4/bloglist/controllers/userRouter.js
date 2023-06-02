const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Route for creating a new user
userRouter.post('/', async (request, response, next) => {
    try {
      const body = request.body;
      const passwordHash = await bcrypt.hash(body.password, 10);
  
      const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      });
  
      const savedUser = await newUser.save(); // Save the user to the database
      response.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  });
  
// Route for getting all users
userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 });
    response.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
