const routerExports = {};
const FriendShip = require('./../dbmodel/FriendShip');
const User = require('./../dbmodel/User');
const { parseToken, sendEmail } = require('../common/util');

routerExports.queryFriends = {
  method: 'get',
  url: '/queryFriends',
  route: async (ctx) => {
    try {
      const result = await FriendShip.find({});
      ctx.body = {
        success: true,
        data: result,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.verifyFriend = {
  method: 'post',
  url: '/verifyFriend',
  route: async (ctx) => {
    try {
      const {
        request: {
          body: { _id: friendId, ...others },
        },
      } = ctx;
      const curFirend = await FriendShip.findOne({ _id: friendId });
      if (!curFirend) throw '找不到这个友情链接哦';
      if (others.verify && !curFirend.verify && curFirend.email) {
        sendEmail(
          `hi~, 你在 https://adaxh.site 提交的友情链接：${
            curFirend.link
          }，已经通过申请，欢迎回访！`,
          curFirend.email
        );
      }
      await FriendShip.updateOne({ _id: friendId }, { $set: others });
      ctx.body = {
        success: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.addFriend = {
  method: 'post',
  url: '/addFriend',
  route: async (ctx) => {
    try {
      const {
        request: { body },
      } = ctx;
      const { link } = body;
      const curFirend = await FriendShip.findOne({ link });
      if (curFirend) {
        if (curFirend && !curFirend.verify) {
          throw '友链已提交过了，您可以前往首页通过“聊骚吗”催一下';
        }
        throw '这个友情链接已存在啦';
      } else {
        delete body.verify;
        await new FriendShip(body).save();
      }
      ctx.body = {
        success: true,
      };
      sendEmail(`有新的链接申请！${JSON.stringify(body)}`);
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleteFriend = {
  method: 'post',
  url: '/deleteFriend',
  route: async (ctx) => {
    try {
      const {
        request: {
          body: { _id: friendId },
        },
      } = ctx;
      await FriendShip.deleteOne({ _id: friendId });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

module.exports = routerExports;
