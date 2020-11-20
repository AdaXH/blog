const fs = require('fs');
const path = require('path');
module.exports = (app) => {
  const files = fs.readdirSync(path.resolve('./middleware'));
  files.forEach((item) => {
    if (item.endsWith('.js')) {
      const middleware = require(path.resolve('./middleware', item));
      app.use(middleware);
    }
  });
  return app;
};
