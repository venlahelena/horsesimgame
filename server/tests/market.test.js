const request = require("supertest");
const app = require("../app"); // adjust if your app file is elsewhere
const Horse = require("../models/Horse");
const mongoose = require("mongoose");

describe("GET /api/market/horses", () => {
  beforeEach(async () => {
    await Horse.insertMany([
      {
        name: "Dusty",
        breed: "Quarter Horse",
        age: 7,
        gender: "gelding",
        stats: { speed: 65, stamina: 70, agility: 60 },
        traits: { coatColor: "palomino", markings: "sock" },
        forSale: true,
        price: 450,
      },
      {
        name: "Shadow",
        breed: "Friesian",
        age: 8,
        gender: "stallion",
        stats: { speed: 75, stamina: 80, agility: 70 },
        traits: { coatColor: "black", markings: "none" },
        forSale: false,
      },
    ]);
  });

  it("should return only horses that are for sale", async () => {
    const res = await request(app).get("/api/market/horses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Dusty");
    expect(res.body[0].forSale).toBe(true);
    expect(res.body[0]).toHaveProperty("price", 450);
  });

  it("should return an empty array if no horses are for sale", async () => {
    await Horse.updateMany({}, { forSale: false });

    const res = await request(app).get("/api/market/horses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should mark a horse as for sale", async () => {
    const horse = await Horse.findOne({ name: "Shadow" });
    const res = await request(app)
      .post(`/api/market/horses/${horse._id}/sell`)
      .send({ price: 999 });
    expect(res.statusCode).toBe(200);
    expect(res.body.forSale).toBe(true);
    expect(res.body.price).toBe(999);
  });

  it("should allow a user to buy a horse", async () => {
    const horse = await Horse.findOne({ name: "Dusty" });
    const buyerId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
    const res = await request(app)
      .post(`/api/market/horses/${horse._id}/buy`)
      .send({ buyerId: buyerId.toString() }); // Send as string
    expect(res.statusCode).toBe(200);
    expect(res.body.forSale).toBe(false);
    expect(res.body.owner).toBe(buyerId.toString()); // Compare as string
  });
});
