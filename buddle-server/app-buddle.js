"use strict";var koa=require("koa"),app=new koa,Database=require("./buddle-server/common/db"),_require=require("./buddle-server/common/util"),getEnv=_require.getEnv,registerBaseMiddleware=_require.registerBaseMiddleware,useMiddleware=require("./buddle-server/common/useMiddleware"),config=require("./buddle-server/serverConfig"),app=useMiddleware(app);(app=registerBaseMiddleware(app,[{baseUrl:__dirname}])).on("error",function(e,r){r.body="error on server ".concat(JSON.stringify(e)),console.log("server error",e,r)}),app.listen(config.port,function(e){new Database(config[getEnv()]).connect()});