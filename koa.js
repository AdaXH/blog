const koa = require('koa');
const app = new koa();
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const views = require('koa-views');
const session = require('koa-session');
const log = require('./middleware/log');
const handleError = require('./middleware/handleError');
const reaceId = require('./middleware/traceId');
const tokenVerify = require('./middleware/tokenVerify');
const cache = require('./middleware/cache');
const router = require('koa-router')();
const Database = require('./common/db');
const { getEnv } = require('./common/util');

const registerRouter = require('./common/registerRoutet');

const config = {
  ...require('./serverConfig'),
  undefined: {
    host: 'mongodb://localhost:27017/graduation',
  },
};

app.keys = ['secret'];
const CONFIG = {
  key: 'SESSION_ID' /** (string) cookie key (default is koa:sess) */,
  maxAge: 172800000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: false /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
};
app
  .use(
    bodyparser({
      enableTypes: ['json', 'form', 'text'],
      jsonLimit: '5mb',
      formLimit: '5mb',
      textLimit: '5mb',
    }),
  )
  .use(cache)
  .use(tokenVerify)
  .use(log)
  .use(handleError)
  .use(reaceId)
  .use(session(CONFIG, app))
  .use(json())
  .use(require('koa-static')(__dirname + '/public'))
  .use(
    views(__dirname + '/views', {
      extension: 'ejs',
    }),
  );

//router
registerRouter(router);
app.use(router.routes(), router.allowedMethods());

//error
app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});
app.listen(config.port, (_) => {
  const database = new Database(config[getEnv()]);
  database.connect();
});
