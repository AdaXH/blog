const User = require('../dbmodel/User');

async function setAllAvatar(result) {
  for (const item of result) {
    const { repeat, toRepeatUserId } = item;
    const { avatar, name, userId, originName, email } = await queryUser(item);
    if (repeat && repeat.length) {
      const newRepeat = await setAllAvatar(repeat);
      item._doc.repeat = newRepeat;
    }
    if (toRepeatUserId) {
      item._doc.toRepeatUserVo = await queryUser({
        userId: toRepeatUserId,
      });
    }
    item._doc = { ...item._doc, avatar, name, userId, originName, email };
  }
  return result;
}

async function queryUser(user) {
  const { userId, name, originName: preName } = user;
  if (!userId || userId == 'null') return user;
  let curUser = await User.findOne({
    [userId ? '_id' : 'name']: userId || name,
  });
  if (!curUser && preName) {
    curUser = await User.findOne({ originName: preName });
  }
  if (!curUser) {
    return { name: '账号已被注销', userId: null };
  }
  if (curUser) {
    const { originName, avatar, _id, name: na, email } = curUser;
    return {
      avatar,
      name: na,
      userId: _id,
      originName,
      email,
    };
  }
  return { name };
}
module.exports = {
  setAllAvatar,
  queryUser,
};
