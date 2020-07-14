export default {
  namespace: 'pagenation',
  state: { moment: 1, message: 1 },
  reducers: {
    setPagesize(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
