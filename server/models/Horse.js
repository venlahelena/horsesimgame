const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['stallion', 'mare', 'gelding'], required: true },
  stats: {
    speed: { type: Number, min: 0, max: 100, required: true },
    stamina: { type: Number, min: 0, max: 100, required: true },
    agility: { type: Number, min: 0, max: 100, required: true },
  },
  traits: {
    coatColor: { type: String, required: true },
    markings: { type: String },
  },
  forSale: { type: Boolean, default: false },
  price: { type: Number, min: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Horse', horseSchema);