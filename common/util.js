const jwt = require('jsonwebtoken');
const request = require('request');
const { SMTPClient } = require('emailjs');

/* 通过token获取JWT的payload部分 */
const getJWTPayload = (token) => {
  // 验证并解析JWT
  if (!token) return;
  return jwt.verify(token, 'secret');
};

module.exports = {
  request2: (url) => {
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
  },
  getJWTPayload,
  parseToken: (authorization) => {
    try {
      const tokenParse = getJWTPayload(authorization);
      if (!tokenParse) throw 'token认证失败';
      return tokenParse;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  },
  reMapError,
  sendEmail: async (content, target = 'xxx.com', title = '友情链接通知') => {
    try {
      const SMTP = 'your smtp code';
      const server = new SMTPClient({
        user: 'xxxxx',
        password: SMTP,
        host: 'smtp.qq.com',
        ssl: true,
      });
      // 开始发送邮件
      server.send(
        {
          text: content, // 邮件内容
          from: 'xxxx@.com', // 谁发送的
          to: target, // 发送给谁的
          subject: title, // 邮件主题
        },
        (err, message) => {
          console.log(err || message);
        },
      );
    } catch (err) {
      console.log('err', err);
    }
  },
  randomCode: (length) => {
    if (!length) return '';
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(Math.floor(Math.random() * 10));
    }
    return result.join('');
  },
  getRandomLength: (length) => {
    return Math.floor(Math.random() * length);
  },
  escapeData: (data) => {
    return data
      .replace(
        /<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g,
        '',
      )
      .replace(
        /<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈+|我草+|我艹/g,
        '**',
      );
  },
};

function reMapError(error) {
  return error instanceof Object
    ? /JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error))
      ? '会话已过期，请重新登录验证'
      : JSON.stringify(error)
    : error.toString();
}
