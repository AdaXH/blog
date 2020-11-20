import Moment from '@/page/moment';
import Message from '@/page/message';
import Article from '@/page/article';
import ArticleDetail from '@/page/article-detail';
import Link from '@/page/link';
import QQ from '@/page/qq';

export const NAVS = [
  {
    text: 'Home',
    icon: 'icon-appstore-fill',
    path: '/home/all',
    menus: [
      {
        text: 'Moment',
        icon: 'icon-moment',
        desc: '动态和更新日志',
        path: '/home/all/moment',
        component: () => Moment,
        color: '#499072',
        abstract: `记录小站，包含pc和移动端的更新日志，或者发个神经丧一下。`,
        bg: 'https://sinacloud.net/ada.bucket/extra/15.jpg',
      },
      {
        text: 'Article',
        icon: 'icon-icon_article',
        desc: '发的一些小文章',
        path: '/home/all/article',
        component: () => Article,
        color: 'rgb(204, 103, 0)',
        abstract: `懒癌患者，我更趋向于动手写代码，文章很少写，除非是不得已的文档，比如系分......`,
        bg: 'https://sinacloud.net/ada.bucket/extra/motain.jpg',
      },
      {
        path: '/home/all/article-detail',
        component: () => ArticleDetail,
        hidden: true,
      },
      {
        text: 'Message',
        icon: 'icon-svgexport--copy',
        desc: '统计下来的留言',
        path: '/home/all/message',
        component: () => Message,
        color: '#1da2b7',
        abstract: `留言板，欢迎吐槽，随便发，我们的口号是：“爱国，和谐 ，友善......”`,
        bg: 'https://sinacloud.net/ada.bucket/extra/zelad-ugly.jpg',
      },
      {
        text: 'Links',
        icon: 'icon-link',
        desc: '友情链接',
        path: '/home/all/link',
        component: () => Link,
        color: '#ad81ce',
        abstract: `友情链接，欢迎加入，没什么特别的要求，只要是符合：“爱过，和谐，友善......”，注意：no ad！`,
        bg: 'https://sinacloud.net/ada.bucket/extra/2girl-express.jpg',
      },
      {
        text: 'QQ login',
        icon: 'icon-QQ',
        path: '/home/all/qq-login',
        desc: '使用qq登录本站',
        component: () => QQ,
        color: '#6ea1d0',
        abstract: `三方登陆：QQ`,
        bg: 'https://sinacloud.net/ada.bucket/extra/4girl-express.jpg',
      },
    ],
  },
  {
    text: 'About',
    icon: 'icon-about',
    path: '/home/about',
    menus: [
      {
        text: 'Github',
        icon: 'icon-huaban88',
        color: 'black',
        desc: 'git仓库',
        onClick: () => (window.location.href = `https://github.com/adaxh`),
      },
      {
        text: 'Old version',
        icon: 'icon-old',
        desc: '前往旧版',
        color: '#7d7c7c',
        onClick: () => (window.location.href = `https://adaxh.site/old`),
      },
      {
        text: 'Home',
        icon: 'icon-appstore-fill',
        desc: '最简洁的首页',
        color: 'white',
        onClick: () => (window.location.href = `https://adaxh.applinzi.com/search`),
      },
    ],
  },
];
