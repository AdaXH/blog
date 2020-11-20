const { reMapError } = require('../common/util');
const { isJSON } = require('../common/util');
module.exports = async (ctx, next) => {
  try {
    const { body } = ctx;
    const isJsonStr = typeof body === 'string';
    // 排除请求页面的API
    if (isJsonStr && !isJSON(body)) return;
    const bodyParse = isJsonStr ? JSON.parse(body) : body;
    // 排除直接返回true的接口
    if (!bodyParse || bodyParse === true) return;
    const { errorMsg } = bodyParse || {};
    if (errorMsg) {
      ctx.body = {
        ...bodyParse,
        errorMsg: reMapError(errorMsg),
        errorStack: errorMsg,
      };
    }
  } catch (error) {
    // console.log("error", error);
    ctx.body = {
      success: false,
      errorMsg: '服务调用异常',
      errorType: 'middleware',
      error,
    };
  } finally {
    await next();
  }
};
