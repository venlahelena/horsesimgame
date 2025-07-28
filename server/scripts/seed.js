// scripts/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Horse = require('../models/Horse');

dotenv.config(); // Load .env file

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to DB');

    // Clear existing horses
    await Horse.deleteMany();

    // Add new horses
    await Horse.insertMany([
      {
        name: 'Storm',
        breed: 'Arabian',
        age: 5,
        gender: 'mare',
        stats: { speed: 85, stamina: 60, agility: 75 },
        traits: { coatColor: 'gray', markings: 'blaze' }
      },
      {
        name: 'Thunder',
        breed: 'Mustang',
        age: 6,
        gender: 'stallion',
        stats: { speed: 80, stamina: 70, agility: 80 },
        traits: { coatColor: 'black', markings: 'star' }
      }
    ]);

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();