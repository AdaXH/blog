import Notification from '../wrapComponent/Notification/index';
import imgsConfig from '../config/extraConfig';

const testUrl =
  'http://sinacloud.net/ada.bucket/extra/1.jpg?KID=sina,1b24azces6uiVWvMDbnN';
export default {
  namespace: 'image',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen(location => {
        if (location.pathname === '/gallery') {
          dispatch({ type: 'loadImg' });
        }
      });
    },
  },
  reducers: {
    callLoadImg(state, { imgs }) {
      return [...imgs];
    },
  },
  effects: {
    *loadImg(action, { select, put, call }) {
      const imgs = yield select(state => state.image);
      if (imgs.length === 0) {
        const testResult = yield call(testImg);
        testResult === 'fail' &&
          Notification.fail({
            msg: '图库云存储资源被拦截, 采用静态资源',
            duration: 5,
          });
        yield put({
          type: 'callLoadImg',
          imgs: testResult === 'fail' ? imgsConfig.local : imgsConfig.online,
        });
      }
    },
  },
};

function testImg() {
  return new Promise(resolve => {
    const testImg = new Image();
    testImg.src = testUrl;
    testImg.onload = _ => resolve('success');
    testImg.onerror = _ => resolve('fail');
  });
}
