import router from 'umi/router';

export const NAVS = [
  {
    link: '/',
    icon: 'icon-homepx',
    // callback: () => router.push('/'),
  },
  {
    link: '/friends',
    icon: 'icon-Friends-',
    color: '#f9a01c',
    callback: () => router.push('/friends'),
  },
  {
    icon: 'icon-QQ',
    color: '#12b7f5',
    callback: () => {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=3532371088&site=qq&menu=yes');
    },
  },
  {
    icon: 'icon-weibo',
    color: '#e93748',
    callback: () => {
      router.push({
        pathname: '/weibo',
        query: {
          src: encodeURIComponent('https://weibo.com/u/2845470360'),
        },
      });
    },
  },
  {
    icon: 'icon-github',
    color: 'balck',
    callback: () => {
      window.open('https://github.com/adaxh');
    },
  },
  {
    icon: 'icon-message',
    callback: () => router.push('/message'),
  },
  {
    icon: 'icon-shequdongtai',
    callback: () => router.push('/moments'),
  },
];

export const LOGO =
  'https://tvax1.sinaimg.cn/crop.0.0.640.640.180/a99a6e98ly8ggdx2amqlaj20hs0hswsl.jpg';

export const TITLE = 'Ada - Home';

export const STATIC_IMG = [
  '#icon-taiyang',
  '#icon-mengbanhangkonghangtian-xingxingstar',
  '#icon-weather-color_moon-stars',
];
