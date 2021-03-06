// 不需要loading的接口
export const NO_LOADING_API = [
  '/upvoteDynamic',
  '/cancelUpvote',
  '/get-customer',
  '/all_user_avatar',
  '/getCaptcha',
  '/getUserInfoByToken',
  '/getArticles',
  '/getAllMessages',
  '/getAllMessage',
  '/getDynamic',
  '/getConfig',
  '/queryArticleById',
  '/updateArticleViewerById',
  '/queryFriends',
  '/netease/get-comment',
];

export const NOERROR_API = ['/getUserInfoByToken'];

// 全屏的路由
export const FULL_SCREEN_PATH = [
  '/more/friend-ship', // 友情链接
  '/more/admin', // 管理员
  '/more/netease', // 网抑云
];

export const EMOJI_CACHE_KEY = '__emoji__list';
