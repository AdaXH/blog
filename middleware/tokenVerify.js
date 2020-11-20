const { ADMIN_API, USER_API } = require('../common/constant');
const User = require('../dbmodel/User');
const { parseToken, reMapError } = require('../common/util');
module.exports = async (ctx, next) => {
  await next();
  try {
    const {
      request: {
        url,
        headers: { authorization },
      },
    } = ctx;
    if (ADMIN_API.includes(url) || USER_API.includes(url)) {
      const checkAdmin = ADMIN_API.includes(url);
      const tokenParse = parseToken(authorization);
      if (!tokenParse) {
        throw '会话过期';
      }
      const user = await User.findOne({ _id: tokenParse._id });
      if (!user) {
        throw '用户不存在';
      }
      if (checkAdmin && !user.admin) {
        throw '当前用户无权限';
      }
    }
  } catch (error) {
    ctx.body = {
      success: false,
      errorMsg: reMapError(error),
      errorStack: error,
    };
  }
};
