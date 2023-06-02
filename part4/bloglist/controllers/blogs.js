const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    const user = await User.findOne(); // Find any user from the database
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id, // Assign the user as the creator of the blog
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); // Update the user's blogs
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});
  blogRouter.delete('/:id', async (request, response, next) => {
    try {
      const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
      if (deletedBlog) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Blog not found' });
      }
    } catch (error) {
      next(error);
    }
  });
  blogRouter.put('/:id', async (request, response, next) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes: request.body.likes },
        { new: true }
      );
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  });

module.exports = blogRouter;
