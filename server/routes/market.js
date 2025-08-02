const express = require("express");
const mongoose = require("mongoose");
const Horse = require("../models/Horse");
const User = require("../models/User"); // If you have a User model
const router = express.Router();

// GET /api/market/horses
// List all horses for sale
router.get("/horses", async (req, res) => {
  try {
    const horses = await Horse.find({ forSale: true });
    res.json(horses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/market/horses/:id/sell
// Mark a horse as for sale (requires price in body)
router.post("/horses/:id/sell", async (req, res) => {
  const { price } = req.body;
  if (!price || price <= 0) {
    return res.status(400).json({ message: "Valid price required" });
  }
  try {
    const horse = await Horse.findByIdAndUpdate(
      req.params.id,
      { forSale: true, price },
      { new: true }
    );
    if (!horse) return res.status(404).json({ message: "Horse not found" });
    res.json(horse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/market/horses/:id/buy
// Buy a horse (transfers ownership, removes from sale)
router.post("/horses/:id/buy", async (req, res) => {
  const buyerId = req.body.buyerId;
  if (!buyerId) return res.status(400).json({ message: "Buyer ID required" });

  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) return res.status(404).json({ message: "Horse not found" });
    if (!horse.forSale)
      return res.status(400).json({ message: "Horse is not for sale" });

    // Transfer ownership (ensure ObjectId type)
    horse.owner = new mongoose.Types.ObjectId(buyerId);
    horse.forSale = false;
    horse.price = undefined;
    await horse.save();

    res.json(horse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
