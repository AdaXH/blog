const mongoose = require('mongoose');

const dynamicCollection = mongoose.model(
  'dynamics',
  mongoose.Schema({
    title: String,
    content: String,
    date: String,
    upvote: Number,
    img: {
      type: String,
      default: 'http://adaxh.applinzi.com/resouce/gallery/7.jpg',
    },
    msg: Array({
      context: String,
      date: String,
      name: String,
    }),
  }),
);
module.exports = dynamicCollection;
