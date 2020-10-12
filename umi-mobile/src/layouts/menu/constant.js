export const MENUS = [
  {
    title: user => user.isLogin ? '注销' : 'qq登录',
    icon: 'icon-qq',
    onClick: (user, dispatch) => {
      try {
        if (user.isLogin) {
          dispatch({
            type: 'user/signOut'
          });
          return
        }
        window.QC.Login.showPopup({
          appId: '101902433',
          redirectURI: 'https://www.adaxh.site/qq',
        });
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  {
    title: 'GitHub',
    icon: 'icon-github1',
    onClick: () => {
      window.open('https://www.github.com/adaxh');
    },
  },
  {
    title: '分享到微博',
    icon: 'icon-weibo',
    onClick: () => {
      const title = 'React - blog';
      const pic =
        'http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8tzjwvaj211l0hmq39.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u9irlkj211x0hndnw.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u5cwpsj211y0hltn0.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8udqz9yj211x0hntde.jpg';
      const p = {
        url: 'https://www.adaxh.site',
        showcount: '1' /*是否显示分享总数,显示：'1'，不显示：'0' */,
        summary: '个人主页，快来看看吧！' /*分享摘要(可选)*/,
        title /*分享标题(可选)*/,
        pics:
          'https://camo.githubusercontent.com/55b9bef92d318357c3688e135d9723519f7085f1/687474703a2f2f7778322e73696e61696d672e636e2f6d773639302f61393961366539386c7931666f783962396c3434696a32307367306c633435372e6a7067' /*分享图片的路径(可选)*/,
        style: '203',
        width: 98,
        height: 22,
      };
      const s = [];
      for (let key in p) s.push(key + '=' + encodeURIComponent(p[key] || ''));
      (function (s, d, e) {
        try {
        } catch (e) {}
        var f = 'http://v.t.sina.com.cn/share/share.php?',
          u = d.location.href,
          p = ['url=', e(u), '&title=', e(title), '&appkey=2924220432', '&pic=', e(pic)].join('');
        function a() {
          if (
            !window.open(
              [f, p].join(''),
              'mb',
              [
                'toolbar=0,status=0,resizable=1,width=620,height=450,left=',
                (s.width - 620) / 2,
                ',top=',
                (s.height - 450) / 2,
              ].join(''),
            )
          )
            u.href = [f, p].join('');
        }
        if (/Firefox/.test(navigator.userAgent)) {
          setTimeout(a, 0);
        } else {
          a();
        }
      })(document, document, encodeURIComponent);
    },
  },
];
