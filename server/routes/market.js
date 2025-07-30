const express = require('express');
const Horse = require('../models/Horse');
const router = express.Router();

// GET /api/market/horses
// Returns all horses marked for sale
router.get('/horses', async (req, res) => {
  try {
    const horses = await Horse.find({ forSale: true }).populate('owner', 'username');
    res.json(horses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch market horses', error: err.message });
  }
});

module.exports = router;