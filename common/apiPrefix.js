const User = require("../dbmodel/User");

async function setAllAvatar(result) {
  for (let item of result) {
    const { avatar, name, userId, originName } = await queryUser(item);
    item.avatar = avatar;
    item.name = name;
    item.userId = userId;
    item.originName = originName;
  }
  return result;
}

async function queryUser(user) {
  const { userId, name, originName: preName } = user;
  let curUser = await User.findOne({
    [userId ? "_id" : "name"]: userId || name,
  });
  if (!curUser) {
    curUser = await User.findOne({
      originName: preName,
    });
  }
  if (curUser) {
    const { originName, avatar, _id, name: na } = curUser;
    return {
      avatar,
      name: na,
      userId: _id,
      originName,
    };
  }
  return { name };
}
module.exports = {
  setAllAvatar,
  queryUser,
};
