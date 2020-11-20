const jwt = require('jsonwebtoken');
const request = require('request');
const { HOST, BASE_MIDDLEWARES } = require('./constant');
const moment = require('moment-timezone');
const { FILTER_URL } = require('./constant');
const fs = require('fs');
moment.tz.setDefault('Asia/Shanghai');
const { SMTPClient } = require('emailjs');

const env = getEnv();

/* 通过token获取JWT的payload部分 */
function getJWTPayload(token) {
  // 验证并解析JWT
  if (!token) return;
  return jwt.verify(token, 'secret');
}
exports.getJWTPayload = getJWTPayload;

// request - promise
exports.request2 = url => {
  return new Promise((resolve, reject) => {
    request(url, (err, _, res) => {
      if (res) {
        resolve(res);
      }
      if (err) {
        reject(err);
      }
    });
  });
};

// parse token body
exports.parseToken = authorization => {
  try {
    const tokenParse = getJWTPayload(authorization);
    if (!tokenParse) throw '会话过期，请重新登陆';
    return tokenParse;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

// send email
exports.sendEmail = async (
  content,
  target = 'xxx@163.com',
  title = '友情链接通知',
) => {
  try {
    if (env === 'development') return;
    const SMTP = 'smtp code';
    const server = new SMTPClient({
      user: 'xxxx@qq.com',
      password: SMTP,
      host: 'smtp.qq.com',
      ssl: true,
    });
    // 开始发送邮件
    server.send(
      {
        text: content, // 邮件内容
        from: 'xxx@qq.com', // 谁发送的
        to: target, // 发送给谁的
        subject: title, // 邮件主题
      },
      (err, message) => {
        console.log(err || message);
      },
    );
    await sendToDing({ title, content });
  } catch (err) {
    console.log('err', err);
  }
};

// get random code
exports.randomCode = length => {
  if (!length) return '';
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * 10));
  }
  return result.join('');
};

// get random number
exports.getRandomLength = length => {
  return Math.floor(Math.random() * length);
};

// replace data
exports.escapeData = data => {
  return data
    .replace(
      /<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g,
      '',
    )
    .replace(
      /<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈+|我草+|我艹/g,
      '**',
    );
};

// set cookit to host
exports.setCookieWithHost = (cookies, key, value, options = {}) => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  HOST.forEach(item => {
    cookies.set(key, value, {
      ...options,
      expires: date,
      httpOnly: false,
      overwrite: false,
      domain: item,
    });
  });
};

// verify target
exports.isTarget = (param, target) => {
  return Object.prototype.toString.call(param).indexOf(target) !== -1;
};

// check json
exports.isJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

// validate url
exports.needFilter = url => {
  for (const item of FILTER_URL) {
    if (url.indexOf(item) !== -1) {
      return true;
    }
  }
  return false;
};

// get Time
exports.getTime = () => {
  return moment().format('MM-DD HH:mm:ss');
};

// read file
exports.readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, info) => {
      err ? reject(err) : resolve(info);
    });
  });
};

// reset error
exports.reMapError = error => {
  return error instanceof Object
    ? /JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error))
      ? '会话已过期，请重新登录验证'
      : JSON.stringify(error)
    : error.toString();
};

// get env
function getEnv() {
  try {
    return process.argv[process.argv.length - 1].replace(/--env=/, '');
  } catch (error) {
    console.log('get env error', error);
    return 'undefined';
  }
}
exports.getEnv = getEnv;

// send msg to DingTalk
async function sendToDing(param) {
  const https = require('https');
  const url =
    'https://oapi.dingtalk.com/robot/send?access_token=0b146a047fbede98aaa8c474aaaa30b954c3e1c912977bfff23948ba85491c25';
  await postWithJson(url, makeData(param));
  function makeData({ title = '通知', content = 'content' }) {
    return JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        title: 'tip',
        text: `**${title}** \n > ${content}`,
      },
    });
  }

  async function postWithJson(url, data) {
    const uriParams = url.split('/robot/');
    const options = {
      path: `/robot/${uriParams[1]}`,
      hostname: uriParams[0].replace('https://', ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, response => {
        response.on('data', data => resolve(JSON.parse(data)));
      });
      request.on('error', e => reject(e.message));
      request.write(data);
      request.end();
    });
  }
}

exports.registerBaseMiddleware = (app, args) => {
  BASE_MIDDLEWARES.forEach(item => {
    const temp = item(app, ...args);
    if (Array.isArray(temp)) {
      app.use(...temp);
    } else {
      app.use(temp);
    }
  });
  return app;
};
