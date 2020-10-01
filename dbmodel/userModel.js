module.exports = {
  name: String,
  avatar: {
    type: String,
    default: '/upload/user_avatar/default_avatar.jpg',
  },
  userId: {
    default: '',
    type: String,
  },
  email: {
    type: String,
    default: '',
  },
  originName: String,
  lastLoginTime: String,
  superAdmin: {
    type: Boolean,
    default: false,
  },
  unionid: String,
  qqUserId: String,
};
