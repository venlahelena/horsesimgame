const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, required: true, enum: ['stallion', 'mare', 'gelding'] },
  stats: {
    speed: { type: Number, min: 0 },
    stamina: { type: Number, min: 0 },
    agility: { type: Number, min: 0 }
  },
  traits: {
    coatColor: String,
    markings: String
  }
});

module.exports = mongoose.model('Horse', horseSchema);