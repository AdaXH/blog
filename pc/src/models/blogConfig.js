import Api from './../utils/request';
import Notification from '../wrapComponent/Notification';
export default {
  namespace: 'blogConfig',
  state: {},
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *getConfig(action, { call, put, select }) {
      try {
        const preConfig = yield select((state) => state.blogConfig);
        if (preConfig.config) return;
        const result = yield call(Api, 'api/getConfig', 'GET');
        if (result.success && result.config) {
          yield put({
            type: 'setState',
            payload: {
              config: result.config,
            },
          });
        }
      } catch (error) {}
    },
    *updateConfig({ config }, { call, put }) {
      try {
        const result = yield call(Api, 'api/updateConfig', 'POST', {
          config,
        });
        if (result.success) {
          yield put({
            type: 'setState',
            payload: { config },
          });
          Notification.success({ msg: '已更新' });
        }
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        // if (pathname === '/home') {
        dispatch({
          type: 'getConfig',
        });
        // }
      });
    },
  },
};
