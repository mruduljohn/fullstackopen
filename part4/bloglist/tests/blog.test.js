const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper');

// const initialBlogs = [
//     {
//       title: 'First Blog',
//       author: 'John Doe',
//       url: 'https://example.com/first-blog',
//       likes: 5,
//     },
//     {
//       title: 'Second Blog',
//       author: 'Jane Smith',
//       url: 'https://example.com/second-blog',
//       likes: 10,
//     },
//   ];
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
  test('creating a new blog post with missing title or url returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'John Doe',
      likes: 10,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
  test('deleting a blog post by ID', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  
    const ids = blogsAtEnd.map(blog => blog.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
  test('updating the likes of a blog post', async () => {
    const blogsAtStart = await blogsInDb();
  
    const blogToUpdate = blogsAtStart[0];
    const updatedLikes = blogToUpdate.likes + 1;
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toBe(updatedLikes);
  
    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    expect(updatedBlog.likes).toBe(updatedLikes);
  });
});
