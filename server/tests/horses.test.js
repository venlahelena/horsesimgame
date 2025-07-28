const request = require('supertest');
const app = require('../app');
const Horse = require('../models/Horse');

describe('Horse API Extended Tests', () => {
  let horseId;

  beforeEach(async () => {
    // Clear collection and add initial horses for tests
    await Horse.deleteMany();

    const horses = await Horse.insertMany([
      {
        name: 'Spirit',
        breed: 'Mustang',
        age: 6,
        gender: 'stallion',
        stats: { speed: 80, stamina: 70, agility: 65 },
        traits: { coatColor: 'brown', markings: 'none' }
      },
      {
        name: 'Bella',
        breed: 'Arabian',
        age: 8,
        gender: 'mare',
        stats: { speed: 90, stamina: 60, agility: 75 },
        traits: { coatColor: 'black', markings: 'star' }
      },
      {
        name: 'Max',
        breed: 'Mustang',
        age: 4,
        gender: 'gelding',
        stats: { speed: 70, stamina: 80, agility: 60 },
        traits: { coatColor: 'grey', markings: 'stripe' }
      },
      {
        name: 'Luna',
        breed: 'Thoroughbred',
        age: 5,
        gender: 'mare',
        stats: { speed: 85, stamina: 75, agility: 70 },
        traits: { coatColor: 'bay', markings: 'none' }
      }
    ]);

    horseId = horses[0]._id.toString(); // Spirit's ID
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
    const updateData = { age: 7, stats: { speed: 85 } };
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

  describe('GET /api/horses with pagination, filtering, sorting', () => {
    test('should return paginated results', async () => {
      const res = await request(app).get('/api/horses?limit=2&page=1');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(2);
    });

    test('should filter by breed', async () => {
      const res = await request(app).get('/api/horses?breed=Mustang');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(h => h.breed === 'Mustang')).toBe(true);
    });

    test('should filter by gender', async () => {
      const res = await request(app).get('/api/horses?gender=mare');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(h => h.gender === 'mare')).toBe(true);
    });

    test('should filter by age range', async () => {
      const res = await request(app).get('/api/horses?minAge=5&maxAge=7');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(h => h.age >= 5 && h.age <= 7)).toBe(true);
    });

    test('should sort by age ascending', async () => {
      const res = await request(app).get('/api/horses?sort=age');
      expect(res.statusCode).toBe(200);
      const ages = res.body.data.map(h => h.age);
      expect(ages).toEqual(ages.slice().sort((a, b) => a - b));
    });

    test('should sort by age descending', async () => {
      const res = await request(app).get('/api/horses?sort=-age');
      expect(res.statusCode).toBe(200);
      const ages = res.body.data.map(h => h.age);
      expect(ages).toEqual(ages.slice().sort((a, b) => b - a));
    });

    test('should return 400 for invalid page or limit', async () => {
      let res = await request(app).get('/api/horses?limit=-1');
      expect(res.statusCode).toBe(400);

      res = await request(app).get('/api/horses?page=0');
      expect(res.statusCode).toBe(400);
    });
  });
});