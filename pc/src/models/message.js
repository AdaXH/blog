import Api from './../utils/request';

export default {
  namespace: 'message',
  state: { data: [], fly: [], pageSizeData: [] },
  reducers: {
    loadMessage(state, { payload }) {
      const fly = [];
      const SINGLE_PAGE_DATA_COUNT = 6;
      for (let item of payload) {
        item.repeat && (item.repeat = item.repeat.reverse());
        item.name === 'Ada' && fly.push(item);
      }
      return {
        ...state,
        data: payload,
        fly: [...fly.slice(0, 6)],
        pageSizeData: payload.slice(0, SINGLE_PAGE_DATA_COUNT),
      };
    },
    init(state) {
      for (let item of state.data) {
        item.open = false;
        item.operation = false;
      }
      return { ...state };
    },
    renderPageSize(
      state,
      {
        payload: { page, cb },
      }
    ) {
      const SINGLE_PAGE_DATA_COUNT = 6;
      const start = (page - 1) * SINGLE_PAGE_DATA_COUNT;
      const pageSizeData = state.data.slice(
        start,
        start + SINGLE_PAGE_DATA_COUNT
      );
      cb && cb();
      return {
        ...state,
        pageSizeData,
      };
    },
    toggleList(state, { payload }) {
      const list = state.data.map(item => {
        item._id === payload && (item.open = !item.open);
        return item;
      });
      return {
        ...state,
        data: list,
      };
    },
    toggleOperation(state, { payload }) {
      if (payload.name === 'operation1') {
        const list = state.data.map(item => {
          item._id === payload._id && (item.operation = !item.operation);
          return item;
        });
        return { ...state, data: list };
      } else {
        for (let item of state.data) {
          if (item._id === payload._parentId && item.repeat) {
            for (let repeat of item.repeat)
              if (repeat._id === payload._id) {
                repeat.operation = !repeat.operation;
                break;
              }
          }
        }
        return { ...state, data: [...state.data] };
      }
    },
  },
  effects: {
    *load({ payload }, { call, put, select }) {
      const messages = yield select(state => state.message.data);
      const result = yield call(Api, 'api/getAllMessages');
      yield payload.cb && payload.cb();
      if (messages.length !== 0) return;
      // const name = [...new Set(result.data.map(item => item.name))]
      // const avatars = yield call(Api, 'api/all_user_avatar', 'POST', { name })
      // const msgs = result.data.map(item => {
      //     for (let _item of avatars.data)
      //         item.name === _item.name && (item.avatar = _item.avatar)
      //     return item
      // })
      yield put({
        payload: result.success ? result.data : [],
        type: 'loadMessage',
      });
    },
    *deleteMsgInner(
      {
        payload: { _id, _parent_id },
      },
      { call, put, select }
    ) {
      const result = yield call(Api, 'api/deleteInnerRepeat', 'POST', {
        _id,
        _parent_id,
      });
      if (result.success) {
        const messages = yield select(state => state.message.data);
        for (let item of messages) {
          if (item._id === _parent_id) {
            item.open = true;
            const _repeat = item.repeat.filter(repeat => repeat._id !== _id);
            item.repeat = [..._repeat];
            break;
          }
        }
        yield put({
          type: 'loadMessage',
          payload: messages,
        });
      }
      return result;
    },
    *deleteMsg(
      {
        payload: { _id },
      },
      { call, put, select }
    ) {
      const result = yield call(Api, 'api/deleteMsgById', 'POST', { _id });
      if (result.success) {
        const messages = yield select(state => state.message.data);
        const _data = messages.filter(item => item._id !== _id);
        yield put({
          type: 'loadMessage',
          payload: _data,
        });
      }
      return result;
    },
    *repeatMsg(
      {
        payload: { toRepeat, _id, info },
      },
      { call, put }
    ) {
      const result = yield call(Api, 'api/repeatmsg', 'POST', {
        _id,
        toRepeat,
        info,
      });
      if (result.success) {
        const { data } = result;
        const name = [...new Set(data.map(item => item.name))];
        const avatars = yield call(Api, 'api/all_user_avatar', 'POST', {
          name,
        });
        const msgs = data.map(item => {
          if (item._id === _id) {
            item.open = true;
          }
          for (let _item of avatars.data)
            item.name === _item.name && (item.avatar = _item.avatar);
          return item;
        });
        yield put({
          type: 'loadMessage',
          payload: msgs.reverse(),
        });
      }
      return result;
    },
    *leaveMessage(action, { call, put, select }) {
      const {
        payload: { date, content, name },
      } = action;
      const result = yield call(Api, 'api/leaveMsg', 'POST', {
        date,
        content,
        name,
      });
      if (result.success) {
        const messages = yield select(state => state.message.data);
        const data = [result.data, ...messages];
        const name = [...new Set(data.map(item => item.name))];
        const avatars = yield call(Api, 'api/all_user_avatar', 'POST', {
          name,
        });
        const msgs = data.map(item => {
          for (let _item of avatars.data)
            item.name === _item.name && (item.avatar = _item.avatar);
          return item;
        });
        yield put({
          type: 'loadMessage',
          payload: msgs,
        });
      }
      return result;
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {  // eslint-disable-line
    //     history.listen(location => {
    //         if (location.pathname === '/message') {
    //             dispatch({ type: 'load', payload: {} })
    //         }
    //     })
    // },
  },
};
