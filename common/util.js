const jwt = require('jsonwebtoken');
const { SMTPClient } = require('emailjs');

/* 通过token获取JWT的payload部分 */
const getJWTPayload = (token) => {
  // 验证并解析JWT
  if (!token) return;
  return jwt.verify(token, 'secret');
};

module.exports = {
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
  timeago,
  sendEmail: async (
    content,
    target = '18668465750@163.com',
    title = '友情链接通知'
  ) => {
    try {
      const SMTP = 'jvqldmrnxehuchic';
      const server = new SMTPClient({
        user: 'adaxh@qq.com',
        password: SMTP,
        host: 'smtp.qq.com',
        ssl: true,
      });
      //开始发送邮件
      server.send(
        {
          text: content, //邮件内容
          from: 'adaxh@qq.com', //谁发送的
          to: target, //发送给谁的
          subject: title, //邮件主题
        },
        (err, message) => {
          console.log(err || message);
        }
      );
    } catch (err) {
      console.log('err', err);
    }
  },
};

function timeago(dateTimeStamp) {
  //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  const minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const halfamonth = day * 15;
  const month = day * 30;
  const now = new Date().getTime(); //获取当前时间毫秒
  const diffValue = now - dateTimeStamp; //时间差

  if (diffValue < 0) {
    return;
  }
  const minC = diffValue / minute; //计算时间差的分，时，天，周，月
  const hourC = diffValue / hour;
  const dayC = diffValue / day;
  const weekC = diffValue / week;
  const monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = ' ' + parseInt(monthC) + '月前';
  } else if (weekC >= 1 && weekC <= 3) {
    result = ' ' + parseInt(weekC) + '周前';
  } else if (dayC >= 1 && dayC <= 6) {
    result = ' ' + parseInt(dayC) + '天前';
  } else if (hourC >= 1 && hourC <= 23) {
    result = ' ' + parseInt(hourC) + '小时前';
  } else if (minC >= 1 && minC <= 59) {
    result = ' ' + parseInt(minC) + '分钟前';
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '刚刚';
  } else {
    const datetime = new Date();
    datetime.setTime(dateTimeStamp);
    const Nyear = datetime.getFullYear();
    const Nmonth =
      datetime.getMonth() + 1 < 10
        ? '0' + (datetime.getMonth() + 1)
        : datetime.getMonth() + 1;
    const Ndate =
      datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
    const Nhour =
      datetime.getHours() < 10
        ? '0' + datetime.getHours()
        : datetime.getHours();
    const Nminute =
      datetime.getMinutes() < 10
        ? '0' + datetime.getMinutes()
        : datetime.getMinutes();
    const Nsecond =
      datetime.getSeconds() < 10
        ? '0' + datetime.getSeconds()
        : datetime.getSeconds();
    result = Nyear + '-' + Nmonth + '-' + Ndate;
  }
  return result;
}

function reMapError(error) {
  return error instanceof Object
    ? /JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error))
      ? '会话已过期，请重新登录验证'
      : JSON.stringify(error)
    : error.toString();
}
