const routerExports = {};
const FriendShip = require("./../dbmodel/FriendShip");
const User = require("./../dbmodel/User");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const { parseToken, reMapError } = require("../common/util");

const secret = "secret";

function getToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: "1day" });
}

routerExports.queryFriends = {
  method: "get",
  url: "/queryFriends",
  route: async ctx => {
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
        errorMsg: reMapError(error),
      };
    }
  },
};

routerExports.verifyFriend = {
  method: "post",
  url: "/verifyFriend",
  route: async ctx => {
    try {
      const {
        headers: { authorization },
        request: {
          body: { _id: friendId, ...others },
        },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const { _id: userId } = tokenParse;
      const user = await User.findOne({ _id: userId });
      if (!user || !user.admin) throw "当前用户无权限";
      //   await new FriendShip(body).save()
      const curFirend = FriendShip.findOne({ _id: friendId });
      if (!curFirend) throw "找不到这个友情链接哦";
      await FriendShip.updateOne({ _id: friendId }, { $set: others });
      ctx.body = {
        success: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      };
    }
  },
};

routerExports.addFriend = {
  method: "post",
  url: "/addFriend",
  route: async ctx => {
    try {
      const {
        request: { body },
      } = ctx;
      const { link } = body;
      const curFirend = await FriendShip.findOne({ link });
      console.log("curFirend", curFirend);
      if (curFirend) {
        throw "已提交过这个友情链接啦";
      } else {
        delete body.verify;
        await new FriendShip(body).save();
      }
      ctx.body = {
        success: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      };
    }
  },
};

module.exports = routerExports;