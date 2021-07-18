const User = require('./buddle-server/dbmodel/User');
const Database = require('./buddle-server/common/db');
const config = require('./buddle-server/serverConfig');

async function test() {
  const database = new Database(config.development);
  database.connect();
  try {
    const res = await new User({
      name: 'admin',
      password: 'YWRtaW4xMjM=',
      superAdmin: true,
      admin: true,
    }).save();
    console.log('res', res);
    console.log('已初始化账号：admin，密码：admin123');
  } catch (error) {
    console.log('error', error);
  }
}
test();
