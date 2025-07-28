// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Routes
const horseRoutes = require('./routes/horses');
app.use('/api/horses', horseRoutes);

module.exports = app;