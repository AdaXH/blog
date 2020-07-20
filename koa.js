const koa = require('koa');
const app = new koa();
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const views = require('koa-views');
const mongoose = require('mongoose');
const session = require('koa-session');
const fs = require('fs');
const log = require('./middleware/log');
const handleError = require('./middleware/handleError');
const reaceId = require('./middleware/traceId');
const tokenVerify = require('./middleware/tokenVerify');
const router = require('koa-router')();
// const logger = require('koa-logger')

const config = {
  ...require('./serverConfig'),
  undefined: {
    host: 'mongodb://localhost:27017/graduation',
  },
};

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '5mb',
    formLimit: '5mb',
    textLimit: '5mb',
  })
);

app
  .use(tokenVerify)
  .use(log)
  .use(handleError)
  .use(reaceId);

app.keys = ['secret'];
const CONFIG = {
  key: 'SESSION_ID' /** (string) cookie key (default is koa:sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 172800000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: false /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
};
app.use(session(CONFIG, app));

app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'ejs',
  })
);

//controllers
try {
  const files = fs.readdirSync(__dirname + '/controllers');
  const controllers = files.filter((item) => item.endsWith('.js'));
  for (let controller of controllers) {
    const controllersExport =
      require(__dirname + '/controllers/' + controller) || undefined;
    if (!controllersExport || !(controllersExport instanceof Object))
      throw controller + '没有提供正确的接口';
    else
      for (let key in controllersExport) {
        const { method, url, route } = controllersExport[key];
        if (!method || !url || !route)
          throw controller + ' 的 "' + key + '" 配置不正确';
        else {
          console.log(`注册API ${url} : ${method}`);
          router[method](url, route);
        }
      }
  }
} catch (error) {
  console.log(error);
}

//router
app.use(router.routes(), router.allowedMethods());

app.listen(config.port, (_) => console.log('server on ' + config.port));

//error
app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

//connect to mongo
mongoose.connect(config[process.env.NODE_ENV].host).then((res) => {
  res
    ? console.log('connected to mongo')
    : console.log('can not connect to mongo');
});
