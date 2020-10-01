const routerExports = {};
const Config = require('./../dbmodel/BlogConfig');

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
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

module.exports = routerExports;
