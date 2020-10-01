const mongoose = require('mongoose');

module.exports = mongoose.model(
  'configs',
  mongoose.Schema({
    bgColor: {
      type: String,
      default: 'rgba(74, 74, 74, 0.64)',
    },
    bgImg: Array({
      img: String,
      color: String,
    }),
    blogTitle: {
      type: String,
      default: 'Ada - Blog',
    },
    welcome: String,
    text1: String,
    text2: String,
    logo: String,
    neteaseKeyword: String,
  }),
);
