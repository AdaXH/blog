const mongoose = require('mongoose');

module.exports = mongoose.model(
  'articles',
  mongoose.Schema({
    date: String,
    year: String,
    type: String,
    summary: String,
    time: String,
    viewer: Number,
    title: String,
    isHidden: {
      default: false,
      type: Boolean,
    },
    message: {
      type: Array({
        msg: String,
        date: String,
        userId: String,
        quickReply: Boolean,
        avatar: {
          type: String,
          default: '/upload/user_avatar/default_avatar.jpg',
        },
        repeat: {
          type: Array({
            msg: String,
            date: String,
            toRepeatUserId: String,
            userId: String,
          }),
          default: [],
        },
      }),
      default: [],
    },
  }),
);
