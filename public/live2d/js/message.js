'use strict';

(function() {
  var defaultMsg = [
    '不要动手动脚的！',
    '今天修了一个bug，新增500个bug！',
    '你还点？！！',
    '你再点我试试？！！',
    '不知羞耻！',
    '嘤嘤嘤，我也会，萌不萌？',
    'rua !!!',
  ];
  // var mapHeader = {
  //     'home': '首页',
  //     'moment': '动态',
  //     'gallery': '文章',
  //     'about': '图库',
  //     'introduction': '简介',
  //     'admin': '管理员界面',
  //     'message': '留言板'
  // }

  function initLive2d() {
    var now = new Date().getHours();
    var text = '';
    if (now > 23 || now <= 5) {
      text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？';
    } else if (now > 5 && now <= 7) {
      text = '早上好！一日之计在于晨，美好的一天就要开始了！';
    } else if (now > 7 && now <= 11) {
      text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
    } else if (now > 11 && now <= 14) {
      text = '中午了，工作了一个上午，现在是午餐时间！';
    } else if (now > 14 && now <= 17) {
      text = '午后很容易犯困呢，今天的运动目标完成了吗？';
    } else if (now > 17 && now <= 19) {
      text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~';
    } else if (now > 19 && now <= 21) {
      text = '晚上好，今天过得怎么样？';
    } else if (now > 21 && now <= 23) {
      text = '已经这么晚了呀，早点休息吧，晚安~~';
    } else {
      text = 'rua !!! ';
    }
    live2dMsg(text);
    document.oncopy = function() {
      live2dMsg('你都复制了什么呀？？？');
    };
  }

  window.live2dInterval = window.setInterval(showHitokoto, 30000);

  function showHitokoto() {
    if (window.fetch) {
      fetch('https://v1.hitokoto.cn/')
        .then((result) => result.json())
        .then((result) => live2dMsg(result.hitokoto));
    }
  }
  window.preOnload = function() {
    var live2dContainer = document.getElementById('landlord');
    initLive2d();
    live2dContainer.addEventListener('click', function() {
      var text =
        defaultMsg[Math.floor(Math.random() * defaultMsg.length + 1) - 1];
      live2dMsg(text);
    });
  };
  window.closeLive = function() {
    var live2dContainer = document.getElementById('landlord');
    clearInterval(window.live2dInterval);
    document.body.removeChild(live2dContainer);
  };
})();
