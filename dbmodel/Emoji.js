const mongoose = require('mongoose');

module.exports = mongoose.model(
  'emojis',
  mongoose.Schema({
    code: String,
    src: String,
  }),
);
