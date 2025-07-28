// server.js
const mongoose = require('mongoose');
const app = require('./app');

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.DB_URI)
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log('Server started on port 5000, DB connected');
      });
    })
    .catch(err => console.error(err));
}