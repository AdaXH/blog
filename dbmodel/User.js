const mongoose = require('mongoose');
const userModel = require('./userModel');

module.exports = mongoose.model(
  'users',
  mongoose.Schema({
    password: String,
    admin: {
      type: Boolean,
      default: false,
    },
    introduce: {
      type: String,
      default: undefined,
    },
    ...userModel,
  }),
);
