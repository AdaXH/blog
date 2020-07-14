// import Api from './../utils/request'

export default {
  namespace: 'search',
  state: { visible: false, result: [] },
  reducers: {
    searchResult(
      state,
      {
        payload: { result, visible },
      }
    ) {
      return {
        ...state,
        result,
        visible,
      };
    },
    close() {
      return { visible: false, result: [] };
    },
    search(state, { result }) {
      return {
        visible: result.length !== 0,
        result,
      };
    },
  },
  effects: {
    *asyncSearch(
      {
        payload: { allData, data },
      },
      { put }
    ) {
      const regEx = new RegExp(data + '|(\\b' + data + '\\b)');
      const result = [];

      for (let item of allData) {
        if (regEx.test(item.summary) || regEx.test(item.content)) {
          let index = item.summary && item.summary.indexOf(data);
          result.push({
            date: !item.upvote ? item.year + '-' + item.date : item.date,
            type: item.upvote ? '动态' : '文章',
            summary: item.upvote
              ? item.content
              : item.summary.slice(index, index + data.length + 100),
            _id: item._id,
          });
        }
      }

      yield put({
        type: 'search',
        result,
      });

      return result;
    },
    // *search({ payload: { data } }, { call, put }) {
    //     const result = yield call(Api, 'api/search', 'POST', { data })
    //     yield put({
    //         type: 'searchResult',
    //         payload: {
    //             result: result.success ? result.result : result,
    //             visible: result.result.length !== 0,
    //         }
    //     })
    //     return result
    // }
  },
};
