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
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // ← This was missing

const horseRoutes = require('./routes/horses');
app.use('/api/horses', horseRoutes);

const marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);

module.exports = app;
