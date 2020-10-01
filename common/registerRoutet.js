const fs = require('fs');

module.exports = (router) => {
  // controller
  try {
    const files = fs.readdirSync('./controllers');
    const controllers = files.filter((item) => item.endsWith('.js'));
    for (const controller of controllers) {
      const controllersExport =
        require('../controllers/' + controller) || undefined;
      if (!controllersExport || !(controllersExport instanceof Object))
        throw controller + '没有提供正确的接口';
      else
        for (const key in controllersExport) {
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
    // ingore
    console.log(error);
  }
};
