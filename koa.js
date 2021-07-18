const root = './buddle-server';

// require('babel-polyfill');
const koa = require('koa');
let app = new koa();
const Database = require(`${root}/common/db`);
const { getEnv, registerBaseMiddleware } = require(`${root}/common/util`);
const useMiddleware = require(`${root}/common/useMiddleware`);
const config = require(`${root}/serverConfig`);

app = useMiddleware(app);
app = registerBaseMiddleware(app, [{ baseUrl: __dirname }]);

app.on('error', (err, ctx) => {
  ctx.body = `error on server ${JSON.stringify(err)}`;
  // todo: should send a error - page
  console.log('server error', err, ctx);
});

app.listen(config.port, (_) => {
  const database = new Database(config[getEnv()]);
  database.connect();
});
