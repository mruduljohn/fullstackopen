const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
    {
      title: 'First Blog',
      author: 'John Doe',
      url: 'https://example.com/first-blog',
      likes: 5,
    },
    {
      title: 'Second Blog',
      author: 'Jane Smith',
      url: 'https://example.com/second-blog',
      likes: 10,
    },
  ];
  beforeEach(async () => {
    await Blog.deleteMany({});
  
    // Insert the initial blogs into the database
    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
  });

describe('Blog list', () => {
  test('returns the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2); // Replace with the actual number of blog posts

  });
  test('blog posts have "id" property instead of "_id"', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toBeDefined();
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });
  test('creating a new blog post', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toMatchObject(newBlog);

    const blogsAfterPost = await Blog.find({});
    expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAfterPost.map(blog => blog.title);
    expect(titles).toContain(newBlog.title);
  });
  test('creating a new blog post with missing likes property', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'John Doe',
      url: 'https://example.com/new-blog',
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const response = await api.get('/api/blogs');
    const blogs = response.body;
  
    expect(blogs).toHaveLength(initialBlogs.length + 1);
  
    const createdBlog = blogs.find(blog => blog.title === newBlog.title);
    expect(createdBlog.likes).toBe(0);
  });
});
