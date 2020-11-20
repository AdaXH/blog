const { v4: uuid } = require('uuid');
const { isJSON } = require('../common/util');

module.exports = async (ctx, next) => {
  try {
    await next();
    const { body } = ctx;
    if (!isJSON(body)) return;
    const traceId = uuid();
    ctx.set('Trace-id', traceId);
    if (!isJSON(body)) return;
    const bodyParse = JSON.parse(body);
    // 排除直接返回true的接口
    if (bodyParse === true) return;
    ctx.body = { ...bodyParse, traceId, pid: process.pid, ppid: process.ppid };
  } catch (error) {
    console.log('error', error);
  }
};
