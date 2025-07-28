const request = require('supertest');
const app = require('../app');
const Horse = require('../models/Horse');

describe('Horse API Extended Tests', () => {
  let horseId;

  beforeEach(async () => {
    const horse = await Horse.create({
      name: 'Spirit',
      breed: 'Mustang',
      age: 6,
      gender: 'stallion',
      stats: { speed: 80, stamina: 70, agility: 65 },
      traits: { coatColor: 'brown', markings: 'none' }
    });
    horseId = horse._id.toString();
  });

  afterEach(async () => {
    await Horse.deleteMany();
  });

  test('GET /api/horses/:id - should return horse by ID', async () => {
    const res = await request(app).get(`/api/horses/${horseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Spirit');
  });

  test('GET /api/horses/:id - should return 404 for non-existent ID', async () => {
    const fakeId = '64f54d6a8cddc937f819cfa1'; // or new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/horses/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/horses/:id - should update horse with valid data', async () => {
    const updateData = { age: 7, 'stats.speed': 85 };
    const res = await request(app)
      .put(`/api/horses/${horseId}`)
      .send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.age).toBe(7);
    expect(res.body.stats.speed).toBe(85);
  });

  test('PUT /api/horses/:id - should return 400 if invalid data', async () => {
    const invalidData = { age: -1 }; // Negative age invalid
    const res = await request(app)
      .put(`/api/horses/${horseId}`)
      .send(invalidData);
    expect(res.statusCode).toBe(400);
  });

  test('PUT /api/horses/:id - should return 404 if horse not found', async () => {
    const fakeId = '64f54d6a8cddc937f819cfa1';
    const res = await request(app)
      .put(`/api/horses/${fakeId}`)
      .send({ age: 8 });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/horses/:id - should delete horse by ID', async () => {
    const res = await request(app).delete(`/api/horses/${horseId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/horses/${horseId}`);
    expect(check.statusCode).toBe(404);
  });

  test('DELETE /api/horses/:id - should return 404 if horse not found', async () => {
    const fakeId = '64f54d6a8cddc937f819cfa1';
    const res = await request(app).delete(`/api/horses/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});