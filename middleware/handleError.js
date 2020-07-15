const { reMapError } = require('../common/util')
const { isJSON } = require('./util')
module.exports = async (ctx, next) => {
  await next()
  try {
    const { body } = ctx
    // 排除请求页面的API
    if (!isJSON(body)) return
    const bodyParse = JSON.parse(body)
    // 排除直接返回true的接口
    if (bodyParse === true) return
    const { errorMsg } = bodyParse
    if (errorMsg) {
      ctx.body = {
        ...bodyParse,
        errorMsg: reMapError(errorMsg),
        errorStack: errorMsg,
      }
    }
  } catch (error) {
    console.log('error', error)
    ctx.body = {
      success: false,
      errorMsg: '服务调用异常',
      errorType: 'middleware',
      error,
    }
  }
}
