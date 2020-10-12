const User = require('../dbmodel/User');

const filterKey = ['name', 'avatar', '_id', 'userId', 'originName', 'email'];

async function setAllAvatar(result) {
  for (const item of result) {
    const { repeat, toRepeatUserId } = item;
    const {
      avatar,
      name,
      userId,
      originName,
      email,
      toRepeatUser,
    } = await queryUser(item);
    if (repeat && repeat.length) {
      const newRepeat = await setAllAvatar(repeat);
      item._doc.repeat = newRepeat;
    }
    if (toRepeatUserId) {
      item._doc.toRepeatUserVo = await queryUser({
        userId: toRepeatUserId,
      });
    }
    item._doc = {
      ...item._doc,
      avatar,
      name,
      userId,
      originName,
      email,
      toRepeatUser,
    };
  }
  return result;
}

async function queryUser(user) {
  const { userId, name, originName: preName, toRepeatUser } = user;
  if (!userId || userId == 'null') return user;
  let curUser = await User.findOne({
    [userId ? '_id' : 'name']: userId || name,
  });
  let newRepeatUser = {};
  if (toRepeatUser && toRepeatUser.userId) {
    newRepeatUser = await await User.findOne(
      { _id: toRepeatUser.userId },
      filterKey.join(' '),
    );
  }
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
      toRepeatUser: newRepeatUser || toRepeatUser,
    };
  }
  return { name };
}
module.exports = {
  setAllAvatar,
  queryUser,
};
