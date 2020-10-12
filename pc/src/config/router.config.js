export default [
  {
    path: '/home',
    component: () => import('@/page/index'),
    exact: false,
    title: 'Home',
  },
  {
    path: '/gallery',
    component: () => import('@/page/gallery/gallery'),
    exact: false,
    title: 'Gallery',
  },
  {
    path: '/moment',
    component: () => import('@/page/dynamic'),
    exact: false,
    title: 'Moment',
  },
  {
    path: '/article',
    component: () => import('@/page/article/'),
    exact: true,
    title: 'Article',
  },
  {
    path: '/message',
    component: () => import('@/page/message'),
    exact: false,
    title: 'Message',
  },
  {
    path: '/introduction',
    component: () => import('@/page/introduction'),
    exact: false,
    title: 'About',
  },
  {
    path: '/more',
    type: 'more',
    title: 'More',
    component: () => import('@/config/children'),
    childRoutes: [
      {
        path: '/more/admin',
        component: () => import('@/page/admin'),
        exact: false,
        title: 'Admin',
        permission: true,
      },
      {
        path: '/more/friend-ship',
        component: () => import('@/page/FriendShip'),
        title: 'Link',
      },
      {
        path: '/more/netease',
        component: () => import('@/page/netease'),
        exact: false,
        title: 'Netease',
      },
    ],
  },
  {
    path: '/article-detail',
    component: () => import('@/page/article/component/ArticleDetail'),
    exact: false,
    hidden: true,
  },
];
