const Path = require('path');
const { readFile } = require('./util');
const { CACHE_REG, NO_CACHE_API } = require('./constant');
module.exports = async (ctx, next) => {
  try {
    const {
      request: { path, header },
      response,
    } = ctx;
    if (CACHE_REG.test(path)) {
      const ifModifidledSince = header['if-modified-since'];
      const fileStat = await readFile(Path.resolve(`./public${path}`));
      const lastModified = fileStat.mtime.toGMTString();
      if (lastModified === ifModifidledSince) {
        response.status = 304;
      } else {
        response.lastModified = lastModified;
      }
    } else if (!NO_CACHE_API.includes(path)) {
      ctx.set('Cache-Control', 'public,max-age=600');
    }
  } catch (error) {
    console.log('cache-error', error);
  } finally {
    await next();
  }
};
// http://localhost:5050/qq/#?access_token=32D56D3E3620895E84DD519056E9F03A&unionid=1&unionid=1&fmt=json
