const mongoose = require('mongoose');

module.exports = mongoose.model(
  'friends',
  mongoose.Schema({
    title: String,
    link: String,
    desc: String,
    icon: String,
    email: String,
    verify: {
      type: Boolean,
      default: false,
    },
  }),
);
