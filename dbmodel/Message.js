const mongoose = require('mongoose');
const userModel = require('./userModel');

module.exports = mongoose.model(
  'messages',
  mongoose.Schema({
    ...userModel,
    content: String,
    date: String,
    repeat: Array({
      info: String,
      date: String,
      toRepeat: String,
      toRepeatUser: userModel,
      ...userModel,
    }),
  }),
);
