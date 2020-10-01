const mongoose = require('mongoose');

module.exports = mongoose.model(
  'moods',
  mongoose.Schema({
    date: String,
    mood: String,
    user: String,
  }),
);
