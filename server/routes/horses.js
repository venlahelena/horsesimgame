const express = require('express');
const Horse = require('../models/Horse');
const { validateHorsePost, validateHorsePut } = require('../middleware/validation');
const router = express.Router();

// GET /api/horses
// Returns paginated, filtered, and sorted list of horses
router.get('/', async (req, res) => {
  try {
    // Parse pagination parameters from query string
    // Default to page 1 and limit 10 if not provided
    let page = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
    let limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;

    // Validate pagination params are positive integers
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    // Build filter object from query parameters
    const filter = {};
    if (req.query.breed) filter.breed = req.query.breed;
    if (req.query.gender) filter.gender = req.query.gender;

    // Age filtering (range)
    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge, 10);
      if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge, 10);
    }

    // Build sort object
    // Accepts sort query param, e.g. sort=age or sort=-speed (descending)
    let sort = {};
    if (req.query.sort) {
      const order = req.query.sort.startsWith('-') ? -1 : 1;
      const field = req.query.sort.replace(/^-/, '');
      sort[field] = order;
    }

    // Get total count of documents matching filter
    const total = await Horse.countDocuments(filter);

    // Execute find query with filter, sort, skip and limit (pagination)
    const horses = await Horse.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    // Send paginated response
    res.json({
      page,
      limit,
      total,
      data: horses,
    });
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;