const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const Blog = require('./models/blog');

const mongoUrl = 'mongodb+srv://phonebook:fireon123@phonebook.e7q880r.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.get('/api/blogs', async (request, response, next) => {
    try {
      const blogs = await Blog.find({});
      response.json(blogs);
    } catch (error) {
      next(error);
    }
  });
  
app.use('/api/blogs', blogRouter);

module.exports = app;

