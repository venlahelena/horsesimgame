const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Horse = require('../models/Horse');
const User = require('../models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to DB');

    await Horse.deleteMany();
    await User.deleteMany();

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'notHashed123',
    });

    // Horses owned by user
    const userHorses = [
      {
        name: 'Storm',
        breed: 'Arabian',
        age: 5,
        gender: 'mare',
        stats: { speed: 85, stamina: 60, agility: 75 },
        traits: { coatColor: 'gray', markings: 'blaze' },
        owner: user._id,
      },
      {
        name: 'Thunder',
        breed: 'Mustang',
        age: 6,
        gender: 'stallion',
        stats: { speed: 80, stamina: 70, agility: 80 },
        traits: { coatColor: 'black', markings: 'star' },
        owner: user._id,
      },
    ];

    // Horses for sale (no owner yet)
    const marketHorses = [
      {
        name: 'Daisy',
        breed: 'Quarter Horse',
        age: 4,
        gender: 'mare',
        stats: { speed: 70, stamina: 65, agility: 72 },
        traits: { coatColor: 'chestnut', markings: 'snip' },
        forSale: true,
        price: 1500,
      },
      {
        name: 'Rocket',
        breed: 'Thoroughbred',
        age: 3,
        gender: 'gelding',
        stats: { speed: 90, stamina: 55, agility: 78 },
        traits: { coatColor: 'bay', markings: 'sock' },
        forSale: true,
        price: 2000,
      },
    ];

    await Horse.insertMany([...userHorses, ...marketHorses]);

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();