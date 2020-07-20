const routerExports = {};
const Config = require('./../dbmodel/BlogConfig');
const User = require('./../dbmodel/User');
const { parseToken, reMapError } = require('../common/util');

routerExports.updateConfig = {
  method: 'post',
  url: '/updateConfig',
  route: async (ctx) => {
    const { config } = ctx.request.body;
    try {
      await Config.updateOne({}, { $set: { ...config } });
      ctx.body = {
        success: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getConfig = {
  method: 'get',
  url: '/getConfig',
  route: async (ctx) => {
    try {
      const config = await Config.findOne({});
      ctx.body = {
        success: true,
        config,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

module.exports = routerExports;
