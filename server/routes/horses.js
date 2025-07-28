const express = require('express');
const Horse = require('../models/Horse');
const { validateHorsePost, validateHorsePut } = require('../middleware/validation');
const router = express.Router();

// GET all horses
router.get('/', async (req, res) => {
  try {
    const horses = await Horse.find();
    res.json(horses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET horse by ID
router.get('/:id', async (req, res) => {
  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) return res.status(404).json({ message: 'Horse not found' });
    res.json(horse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new horse (full validation)
router.post('/', validateHorsePost, async (req, res) => {
  const { name, breed, age, gender, stats, traits } = req.body;

  const newHorse = new Horse({
    name,
    breed,
    age,
    gender,
    stats,
    traits,
  });

  try {
    const savedHorse = await newHorse.save();
    res.status(201).json(savedHorse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update horse by ID (partial validation)
router.put('/:id', validateHorsePut, async (req, res) => {
  try {
    const updateData = {};

    function flatten(obj, prefix = '') {
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value, prefix + key + '.');
        } else {
          updateData.$set = updateData.$set || {};
          updateData.$set[prefix + key] = value;
        }
      }
    }

    flatten(req.body);

    const updatedHorse = await Horse.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedHorse) return res.status(404).json({ message: 'Horse not found' });
    res.json(updatedHorse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE horse by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedHorse = await Horse.findByIdAndDelete(req.params.id);
    if (!deletedHorse) return res.status(404).json({ message: 'Horse not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;