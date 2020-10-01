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
