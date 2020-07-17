const uuid = require('uuid/v1')
const { isJSON } = require('./util')

module.exports = async (ctx, next) => {
  await next()
  try {
    const { body } = ctx
    if (!isJSON(body)) return
    const traceId = uuid()
    ctx.set('Trace-id', traceId)
    if (!isJSON(body)) return
    const bodyParse = JSON.parse(body)
    // 排除直接返回true的接口
    if (bodyParse === true) return
    ctx.body = { ...bodyParse, traceId }
  } catch (error) {
    console.log('error', error)
  }
}
