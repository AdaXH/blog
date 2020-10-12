import request from '@/util/request';
import Cookies from 'js-cookie';
// import { Base64 } from 'js-base64';

// function isDev() {
//   return /localhost/.test(window.location.href);
// }

// const { host } = window.location;
// const prefix = /www/.test(host) ? host : host.replace(/www/g, '');

export default {
  namespace: 'user',
  state: { isLogin: false, user: {}, customer: 0 },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'save' });
    },
    *getUserInfo(_, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      if (user.isLogin) return;
      const result = yield call(request, '/api/getUserInfoByToken', 'POST');
      yield put({
        type: 'callGetUserInfo',
        payload: {
          isLogin: result.success,
          ...(result instanceof Object ? result.user : {}),
        },
      });
    },
  },
  reducers: {
    callGetUserInfo(state, { payload }) {
      return {
        ...payload,
      };
    },
    signOut() {
      removeInfo();
      return {
        isLogin: false,
        user: {},
      }
    }
  },
};

function removeInfo() {
  [
    '.adaxh.site',
    'www.adaxh.site',
    'adaxh.site',
    'localhost',
    'adaxh.applinzi.com',
    'www.adaxh.applinzi.com',
  ].forEach((domain) => {
    Cookies.remove('user', {
      domain,
    });
    Cookies.remove('token', { domain });
  });
}