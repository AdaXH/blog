const mongoose = require('mongoose');

const customerCollection = mongoose.model(
  'customers',
  mongoose.Schema({
    number: Number,
  }),
);

module.exports = customerCollection;
