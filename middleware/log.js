const { isTarget, isJSON, needFilter } = require('./util')
module.exports = async (ctx, next) => {
  const {
    request: { body = {}, url, method, header },
  } = ctx
  const start = Date.now()
  await next()
  const end = Date.now()
  try {
    const res = JSON.parse(isJSON(ctx.body, 'String') ? ctx.body : '{}')
    const { success, errorMsg } = res
    const agentUrl = header['user-agent']
    if (needFilter(agentUrl) || needFilter(url)) return
    if (
      (method === 'GET' && url.includes('upload/user_avatar')) ||
      url.includes('resouce/gallery')
    )
      return
    const userAgent = /Mobile+|iPhone+|Android/.test(agentUrl) ? 'Mobile' : 'pc'
    const date = new Date()
    //${date.getFullYear()}年
    const time = `${date.getMonth() +
      1}月${date.getDate()}号 ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`
    console.log(`客户端: ${agentUrl || ''}`)
    let target = 'unknown'
    if (userAgent === 'Mobile') {
      target = 'Mobile'
    } else if (/native/.test(url)) {
      target = 'Native'
    } else {
      target = 'dva'
    }
    console.log(`版本：${target}， ${time}`)
    const log = `[${method} ${end - start}ms ${url}] 
request: ${JSON.stringify(isTarget(body, 'Object') ? body : {})} 
response: ${JSON.stringify({ success, errorMsg })}
    `
    console.log(log)
  } catch (error) {
    console.log('error', error)
  }

  // console.log(body)
}
