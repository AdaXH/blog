import Api from '@/utils/request';
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
    *customer(action, { call, put, select }) {
      const customer = yield select((state) => state.user.customer);
      if (!customer) {
        const newCustomer = yield call(Api, 'api/get-customer');
        if (newCustomer.success) {
          yield put({
            type: 'setCustomer',
            customer: newCustomer.data.number,
          });
          return newCustomer.data.number;
        }
      }
      yield put({
        type: 'setCustomer',
        customer,
      });
      return customer;
    },
    *register({ payload: { pwd, name, captchaCode, email } }, { call, put }) {
      const result = yield call(Api, 'api/register', 'POST', {
        name,
        pwd,
        captchaCode,
        email,
      });
      result.success &&
        (yield put({
          type: 'callRegister',
          payload: { ...result, isLogin: false },
        }));
      return result;
    },
    *setAvatar(state, { call, put }) {
      const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i += 1) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary); //base64
      };
      const {
        payload: { avatar, name, fileName },
      } = state;
      const result = yield call(Api, 'api/set-avatar', 'POST', {
        avatar,
        name,
        fileName: fileName.replace(/jpeg+|JPEG/g, 'jpg'),
      }) || { src: {} };
      yield put({
        type: 'callSetAvatar',
        payload: {
          ...result,
          [result.success && 'avatar']:
            result.success &&
            `data:image/png;base64,${arrayBufferToBase64(result.src.bf.data)}`,
          avatarSrc: result.src.avatar,
        },
      });
      return result;
    },
    *getUserInfo({ payload: { cb } }, { call, put }) {
      const result = yield call(Api, 'api/getUserInfoByToken', 'POST');
      yield put({
        type: 'callGetUserInfo',
        payload: {
          isLogin: result.success,
          ...(result instanceof Object ? result.user : {}),
          // imgBlocked: testResult === 'fail',
        },
      });
      yield cb && cb();
    },
    *login({ payload: { pwd, name, state } }, { call, put, select }) {
      const result = yield call(Api, 'api/login', 'POST', {
        name,
        pwd,
        state,
      });
      const customer = yield select((s) => s.user.customer);
      yield put({
        type: 'callLogin',
        payload: {
          isLogin: result.success,
          ...(result instanceof Object ? result : {}),
          customer,
        },
      });
      return result;
    },
  },
  reducers: {
    setCustomer(state, { customer }) {
      return {
        ...state,
        customer,
      };
    },
    callSetAvatar(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    signOut(state) {
      removeInfo();
      return {
        isLogin: false,
        user: {},
      };
    },
    callGetUserInfo(state, { payload }) {
      return {
        ...payload,
      };
    },
    callRegister(state, { payload }) {
      return payload;
    },
    callLogin(state, { payload }) {
      // if (payload.success && payload.token) {
      //   const cfg = {
      //     domain: !isDev() ? 'localhost' : prefix,
      //     expires: 2,
      //   };
      //   Cookies.set('token', payload.token, cfg);
      //   Cookies.set('user', Base64.encode(payload.name), cfg);
      // }
      // console.log('payload', payload);
      return payload;
    },
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
