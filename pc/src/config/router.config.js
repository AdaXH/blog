import { Index } from '../components/index/index';
import Dynamic from '../components/dynamic/dynamic';
import Message from '../components/message/message';
import Gallery from '../components/gallery/gallery';
import Introduction from '../components/introduction';
import Admin from '../components/admin';
import Article from '../components/article/article';
import Detail from '../components/article/ArticleDetail';
import FriendShip from '../components/FriendShip';

export default [
  {
    path: '/home',
    Component: () => Index,
    exact: false,
    title: '首页',
  },
  {
    path: '/gallery',
    Component: () => Gallery,
    exact: false,
    title: '图库',
  },
  {
    path: '/moment',
    Component: () => Dynamic,
    exact: false,
    title: '动态',
  },
  {
    path: '/article',
    Component: () => Article,
    exact: true,
    title: '文章',
  },
  {
    path: '/message',
    Component: () => Message,
    exact: false,
    title: '留言板',
  },
  {
    path: '/admin',
    Component: () => Admin,
    exact: false,
    title: '管理员',
    permission: true,
  },
  {
    path: '/friend-ship',
    Component: () => FriendShip,
    title: '友情链接',
  },
  {
    path: '/introduction',
    Component: () => Introduction,
    exact: false,
    title: '关于',
  },
  {
    path: '/article-detail',
    Component: () => Detail,
    exact: false,
    hidden: true,
  },
];
