const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

describe('Blog list', () => {
  test('returns the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(1); // Replace with the actual number of blog posts

  });
  test('blog posts have "id" property instead of "_id"', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toBeDefined();
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });
});
