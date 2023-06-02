const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../middleware/userExtractor');


const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};


blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/',userExtractor, async (request, response, next) => {
  try {
    const body = request.body;
    const token = getTokenFrom(request);
    if (!token) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }
    const decodedToken = jwt.verify(token,process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }
    const user = request.user;
    // const user = await User.findById(decodedToken.id); // Find any user from the database
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
blogRouter.delete('/:id',userExtractor, async (request, response, next) => {
  try {
    const token = getTokenFrom(request);
    console.log('Token:', token);
    if (!token) {
      console.log('Token missing or invalid');
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log('Decoded token:', decodedToken);
    
    if (!decodedToken.id) {
      console.log('Token missing or invalid');
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const blog = await Blog.findById(request.params.id);
    console.log('Blog:', blog);
    
    if (!blog) {
      console.log('Blog not found');
      return response.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user.toString() !== decodedToken.id) {
      console.log('Unauthorized');
      return response.status(403).json({ error: 'Unauthorized' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    console.log('Blog deleted');
    
    response.status(204).end();
  } catch (error) {
    console.log('Error:', error);
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
