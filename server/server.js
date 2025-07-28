const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

mongoose.connect(process.env.DB_URI)
    .then(() => app.listen(process.env.PORT || 5000, () => {
        console.log('Server started on port 5000, DB connected');
    }))
    .catch(err => console.error(err));