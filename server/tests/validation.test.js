const request = require('supertest');
const app = require('../app');
const Horse = require('../models/Horse');

describe('Horse API Validation Tests', () => {
  afterEach(async () => {
    await Horse.deleteMany();
  });

  test('POST /api/horses - should return 400 with detailed message for missing required fields', async () => {
    const invalidData = {
      name: '',               // empty string, invalid
      breed: 'Arabian',
      age: -5,                // invalid age
      gender: 'dragon',       // invalid enum
      stats: { speed: 150, stamina: -10, agility: 50 },  // invalid stats values
      traits: { coatColor: '', markings: 'none' }        // empty coatColor invalid
    };

    const res = await request(app).post('/api/horses').send(invalidData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/name|age|gender|speed|stamina|coatColor/);
  });

  test('PUT /api/horses/:id - should return 400 with message for invalid nested stats', async () => {
    // Create valid horse first
    const horse = await Horse.create({
      name: 'Test',
      breed: 'Breed',
      age: 3,
      gender: 'mare',
      stats: { speed: 50, stamina: 50, agility: 50 },
      traits: { coatColor: 'brown', markings: '' }
    });

    const invalidUpdate = {
      stats: { speed: 101, stamina: 0, agility: -1 },  // invalid stats values
      traits: { coatColor: 'black' }
    };

    const res = await request(app).put(`/api/horses/${horse._id}`).send(invalidUpdate);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/speed|agility/);
  });
});
