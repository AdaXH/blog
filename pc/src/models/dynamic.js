import Api from './../utils/request';

export default {
    namespace: 'dynamic',
    state: { dynamicDetail: { visible: false }, dynamic: [] },
    reducers: {
        loadDynamic(state, { payload }) {
            payload && payload.cb && payload.cb();
            return {
                ...state,
                dynamic: [...payload]
            };
        },
        reduceUpvote(state, { payload }) {
            const { dynamicDetail, dynamic } = state;
            const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || [];
            const index = hasUpvote.findIndex(item => item === payload);
            hasUpvote.splice(index, 1);
            localStorage.setItem('hasUpvote', JSON.stringify([...hasUpvote]));
            for (let item of dynamic)
                if (item._id === payload) {
                    item.upvote = dynamicDetail.upvote - 1;
                    break;
                }
            return {
                ...state,
                dynamic: [...dynamic],
                dynamicDetail: {
                    ...dynamicDetail,
                    upvote: dynamicDetail.upvote - 1
                }
            };
        },
        callDiscuss(state, { payload }) {
            const { dynamic, dynamicDetail } = state;
            for (let item of dynamic)
                if (item._id === payload._id) {
                    item.msg = [...payload.msg];
                }
            dynamicDetail.msg = [...payload.msg];
            return {
                ...state,
                dynamic: [...dynamic],
                dynamicDetail: { ...dynamicDetail }
            };
        },
        callUpvote(state, { payload: { _id } }) {
            const { dynamic, dynamicDetail } = state;
            const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || [];

            for (let item of dynamic)
                if (item._id === _id) {
                    item.upvote = dynamicDetail.upvote + 1;
                    break;
                }
            localStorage.setItem('hasUpvote', JSON.stringify([...hasUpvote, _id]));
            return {
                ...state,
                dynamic: [...dynamic],
                dynamicDetail: {
                    ...dynamicDetail,
                    upvote: dynamicDetail.upvote + 1
                }
            };
        },
        dynamicDetail(state, { payload }) {
            const { dynamic } = state;
            const detail = dynamic.filter(item => item._id === payload);
            return {
                ...state,
                dynamicDetail: {
                    visible: true,
                    ...detail[0]
                }
            };
        },
        closeDetail(state) {
            return {
                ...state,
                dynamicDetail: { visible: false }
            };
        },
        toggleOpen(state) {
            const { dynamicDetail } = state;
            return {
                ...state,
                dynamicDetail: {
                    ...dynamicDetail,
                    open: !dynamicDetail.open
                }
            };
        },
        callDelete(state, { _id }) {
            const data = state.dynamic.filter(item => item._id !== _id);
            return {
                ...state,
                dynamic: [...data]
            };
        },
        callSetDynamicImg(state, { _id, img }) {
            const { dynamic } = state;
            for (let item of dynamic) {
                if (item._id === _id) {
                    item.img = img;
                    break;
                }
            }
            return {
                ...state,
                dynamic: [...dynamic]
            };
        },
        callUpdate(state, { title, content, img, _id }) {
            const { dynamic } = state;
            for (let item of dynamic) {
                if (item._id === _id) {
                    item.img = img;
                    item.title = title;
                    item.content = content;
                    break;
                }
            }
            return {
                ...state,
                dynamic: [...dynamic]
            };
        }
    },
    effects: {
        *addDynamic({ title, content, img, date, upvote }, { put, call }) {
            const src = img === 'admin' ? 'http://adaxh.applinzi.com/resouce/gallery/7.jpg' : img;
            const result = yield call(Api, 'api/addDynamic', 'POST', { title, content, img: src, date, upvote });
            yield put({
                type: 'load',
                payload: result.data.reverse(),
                reload: true
            });
            return result;
        },
        *updateDynamic({ title, content, img, _id }, { put, call }) {
            const result = yield call(Api, 'api/updateDynamic', 'POST', { title, content, img, _id });
            if (result) {
                yield put({
                    type: 'callUpdate',
                    _id,
                    title,
                    content,
                    img
                });
            }
            return result;
        },
        *setDynamicImg({ payload: { name, dataUrl, _id } }, { call, put }) {
            const result = yield call(Api, 'api/setDynamicImg', 'POST', { dataUrl, name });
            return result;
        },
        * deleteById({ _id }, { call, put }) {
            const result = yield call(Api, 'api/deleteDynamic', 'POST', { _id });
            if (result.success) {
                yield put({
                    type: 'callDelete',
                    _id
                });
            }
            return result;
        },
        * upvote(action, { call, put }) {
            const { payload: { _id, cb, isAdd } } = action;
            if (isAdd) {
                const result = yield call(Api, 'api/upvoteDynamic', 'POST', { _id });
                cb && cb(result);
                if (result.success) {
                    yield put({
                        type: 'callUpvote',
                        payload: { _id }
                    });
                }
            } else {
                yield call(Api, 'api/cancelUpvote', 'POST', { _id });
                yield put({
                    type: 'reduceUpvote',
                    payload: _id
                });
            }

        },
        * leaveMsg(action, { call, put }) {
            const { payload: { msg, _id, name } } = action;
            const result = yield call(Api, 'api/discussDynamic', 'POST', { msg, _id, name });
            if (result.success) {
                yield put({
                    type: 'callDiscuss',
                    payload: result.data
                });
            } else yield put({
                type: 'loadDynamic',
                payload: {}
            });
            return result.success;
        },
        * load({ payload, reload }, { call, put, select }) {
            const dynamic = yield select(state => state.dynamic.dynamic);
            if (reload || !dynamic.length) {
                const result = yield call(Api, 'api/getDynamic');
                yield put({
                    payload: result.success ? result.data : result,
                    type: 'loadDynamic'
                });
            }
            yield payload.cb && payload.cb();
        }
    },
    // subscriptions: {
    //     setup({ dispatch, history }) {  // eslint-disable-line
    //         history.listen(location => {
    //             if (location.pathname === '/dynamic') {
    //                 dispatch({ type: 'load', payload: {} })
    //             }
    //         })
    //     },
    // }
};