exports.MAX_PROCESS = 4;

exports.HOST = [
  'www.adaxh.site',
  '.adaxh.site',
  'www.adaxh.applinzi.com',
  '.adaxh.applinzi.com',
  'localhost',
];

// 不需要日志输出的api
exports.FILTER_URL = [
  'live2d',
  'Baiduspider',
  'Googlebot',
  'dva-version',
  'favicon.ico',
  'PhantomJS',
  'index.php',
  'pc-src',
  'umi-mobile',
  'set-avatar',
  'async',
  'dynamic_img',
];
// 管理员权限接口校验
exports.ADMIN_API = [
  '/deleteArticle', // 删除文章
  '/saveArticle', // 保存文章
  '/updateArticleById', // 更新文章
  '/updateConfig', // 更新博客配置
  '/deleteDynamic', // 删除动态
  '/setDynamicImg', // 设置动态图片
  '/addDynamic', // 发布动态
  '/updateDynamic', // 更新动态
  '/deleteDynamicMsg', // 删除动态的留言
  '/verifyFriend', // 审核友链
  '/deleteFriend', // 删除友链
  '/uploadGallery', // 图库图片操作
  '/setPics', // 移动端首页图片配置
  '/updateIntroduce', // 更新自我介绍
  '/queryUsers', // 查询所有用户
  '/changeUserStatus', // 更改用户身份
  '/deleteUser', // 删除用户
  '/updateEmoji', // 更新emoji
];

// 校验登陆状态的api
exports.USER_API = [
  '/deleteInnerRepeat', // 删除自己的留言
  '/repeatmsg', // 留言回复
  '/deleteMsgById', // 删除留言
  // '/leaveMsg', // 留言
  '/set-avatar', // 设置头像
  '/updateUserInfo', // 更新用户信息
  '/discussDynamic', // 评论动态
  // "/discussArticle", // 文章留言
  '/replyArticleMsg', // 文章评论
  '/deleteArticleMsg', // 删除文章留言
  '/deleteArticleReplyMsg', // 删除文章回复
  '/updateEmoji', // 更新emoji
];

exports.NO_CACHE_API = ['/qq_login'];

// 需要协商缓存的文件|文件夹
exports.CACHE_REG = /pc-src|mobile|resouce|umi/;

// 基础中间件
exports.BASE_MIDDLEWARES = [
  () =>
    // bodyparser
    require('koa-bodyparser')({
      enableTypes: ['json', 'form', 'text'],
      jsonLimit: '5mb',
      formLimit: '5mb',
      textLimit: '5mb',
    }),
  app => {
    // session
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
    return require('koa-session')(CONFIG, app);
  },
  () => require('koa-json')(), // json
  (_, { baseUrl }) =>
    // static
    require('koa-static')(baseUrl + '/public'),
  (_, { baseUrl }) =>
    // koa-views
    require('koa-views')(baseUrl + '/views', {
      extension: 'ejs',
    }),
  () => {
    const registerRouter = require('./registerRouter');
    const router = require('koa-router')();
    registerRouter(router);
    return [router.routes(), router.allowedMethods()];
  },
];
