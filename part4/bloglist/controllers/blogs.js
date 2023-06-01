const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => {
      console.log('Error:', error);
      response.status(500).end();
    });
});

blogRouter.post('/', async (request, response) => {
    const body = request.body;
  
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' });
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author || '',
      url: body.url,
      likes: body.likes || 0, // Set likes to 0 if it's missing in the request
    });
  
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog.toJSON());
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
