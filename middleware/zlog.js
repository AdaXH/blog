const { isTarget, isJSON, needFilter, getTime } = require('../common/util');

module.exports = async (ctx, next) => {
  const {
    request: { body = {}, url, method, header },
  } = ctx;
  const start = Date.now();
  await next();
  const end = Date.now();
  try {
    const res = JSON.parse(isJSON(ctx.body, 'String') ? ctx.body : '{}');
    const { success, errorMsg, traceId } = res;
    const agentUrl = header['user-agent'];
    if (needFilter(agentUrl) || needFilter(url)) return;
    if (
      (method === 'GET' && url.includes('upload/user_avatar')) ||
      url.includes('resouce/gallery')
    )
      return;
    const userAgent = /Mobile+|iPhone+|Android/.test(agentUrl)
      ? 'Mobile'
      : 'pc';
    const time = getTime();
    let target = 'unknown';
    if (userAgent === 'Mobile') {
      target = 'Mobile';
    } else if (/native/.test(header.referer)) {
      target = 'Native';
    } else {
      target = 'dva';
    }
    if (body instanceof Object && 'summary' in body) {
      delete body.summary;
    }
    if ('dataUrl' in body) {
      delete body.dataUrl;
    }
    const log = `客户端: ${agentUrl || ''}
版本： ${target}
date: ${time} 
api:  [${method} ${end - start}ms ${url}] 
request: ${JSON.stringify(isTarget(body, 'Object') ? body : {})} 
response: ${JSON.stringify({ success, errorMsg, traceId })}
    `;
    console.log(log);
  } catch (error) {
    console.log('error', error);
  }

  // console.log(body)
};
