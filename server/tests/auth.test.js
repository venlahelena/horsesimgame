const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcrypt');

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'securePassword123',
  };

  // Register user before each test that needs it
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await User.create({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    });
  });

  it('should register a new user', async () => {
    const newUser = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'newpass123',
    };

    const res = await request(app).post('/api/auth/register').send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', newUser.username);
    expect(res.body.user).toHaveProperty('email', newUser.email);
  });

  it('should not register with an existing email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/email already in use/i);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongPassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should reject login with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not@found.com',
      password: 'whatever',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});