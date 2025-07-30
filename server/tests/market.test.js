const request = require('supertest');
const app = require('../app'); // adjust if your app file is elsewhere
const Horse = require('../models/Horse');

describe('GET /api/market/horses', () => {
  beforeEach(async () => {
    await Horse.insertMany([
      {
        name: 'Dusty',
        breed: 'Quarter Horse',
        age: 7,
        gender: 'gelding',
        stats: { speed: 65, stamina: 70, agility: 60 },
        traits: { coatColor: 'palomino', markings: 'sock' },
        forSale: true,
        price: 450
      },
      {
        name: 'Shadow',
        breed: 'Friesian',
        age: 8,
        gender: 'stallion',
        stats: { speed: 75, stamina: 80, agility: 70 },
        traits: { coatColor: 'black', markings: 'none' },
        forSale: false
      }
    ]);
  });

  it('should return only horses that are for sale', async () => {
    const res = await request(app).get('/api/market/horses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Dusty');
    expect(res.body[0].forSale).toBe(true);
    expect(res.body[0]).toHaveProperty('price', 450);
  });

  it('should return an empty array if no horses are for sale', async () => {
    await Horse.updateMany({}, { forSale: false });

    const res = await request(app).get('/api/market/horses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});