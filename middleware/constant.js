module.exports = {
  // 不需要日志输出的api
  FILTER_URL: [
    'live2d',
    'Baiduspider',
    'Googlebot',
    'dva-version',
    'favicon.ico',
    'PhantomJS',
    'index.php',
    'pc-src',
    'umi-mobile',
  ],
  // 管理员权限接口校验
  ADMIN_API: [
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
  ],
  // 校验登陆状态的api
  USER_API: [
    '/deleteInnerRepeat', // 删除自己的留言
    '/repeatmsg', // 留言回复
    '/deleteMsgById', // 删除留言
    '/leaveMsg', // 留言
    '/set-avatar', // 设置头像
    '/updateUserInfo', // 更新用户信息
    '/discussDynamic', // 评论动态
  ],
};
