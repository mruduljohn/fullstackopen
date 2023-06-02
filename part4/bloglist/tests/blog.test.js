require('dotenv').config();
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
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
    const user = await User.findOne({});
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 10,
    };
    
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Attach the token in the Authorization header
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
      author: 'Born Doe',
      url: 'https://example.com/news-blogs',
    };
    
    const user = await User.findOne({}); // Replace with the appropriate code to find an existing user from your database
    const token = jwt.sign({ id: user._id }, process.env.SECRET);

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      author: 'Mohn Doe',
      likes: 10,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(500);
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
describe('User management', () => {
  beforeEach(async () => {
    await User.deleteMany({}); 
    await User.insertMany(helper.initialUsers);
  });
  test('creating a new user with valid data', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAfterPost = await helper.usersInDb();
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length + 1);

    const usernames = usersAfterPost.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });
  test('creating a new user fails with missing username', async () => {
    const newUser = {
      name: 'Test User',
      password: 'testpassword'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('creating a new user fails with missing password', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('creating a new user fails with short username', async () => {
    const newUser = {
      username: 'te',
      name: 'Test User',
      password: 'testpassword'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('creating a new user fails with short password', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'pw'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('creating a new user fails with duplicate username', async () => {
    const existingUser = helper.initialUsers[0];
    const newUser = {
      username: existingUser.username,
      name: 'Test User',
      password: 'testpassword'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('getting all users', async () => {
    const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialUsers.length);
  });
});

module.exports={
  api,
};