import Api from './../utils/request';
export default {
    namespace: 'article',
    state: { data: null, hot: [], detail: {}, articleType: 'All' },
    reducers: {
        loadArticle(state, { payload }) {
            const hot = JSON.parse(payload).sort((a, b) => b.viewer - a.viewer);
            return {
                ...state,
                detail: { visible: false },
                data: [...JSON.parse(payload)],
                hot: hot.slice(0, 3),
            };
        },
        filter(state, { payload }) {
            const preData = state.data || [];
            if (/0/.test(payload)) {
                for (let item of preData) item.show = item.year === payload;
                return { ...state };
            }
            if (payload === 'Time') {
                for (let item of preData) item.show = true;
                return { ...state, data: [...preData.reverse()] };
            }
            for (let item of preData) {
                item.show = payload === item.type || payload === 'All';
            }
            return {
                ...state,
                data: preData.length ? [...preData] : null,
                articleType: payload,
            };
        },
        callAddViewer(state, { _id }) {
            const detail = state.data.filter(item => item._id === _id);
            return {
                ...state,
                detail: { ...detail[0], visible: detail.length !== 0 },
            };
        },
        callDelete(state, { _id }) {
            const data = state.data.filter(item => item._id !== _id);
            return {
                ...state,
                data: [...data],
            };
        },
        callUpdate(state, { _id, _type, summary, title }) {
            const { data } = state;
            for (let item of data) {
                if (item._id === _id) {
                    item.summary = summary;
                    item.type = _type;
                    item.title = title;
                    break;
                }
            }
            return {
                ...state,
                data: [...data],
            };
        },
    },
    effects: {
        *publishArticle(
            {
                arg: { date, year, summary, type, time, title },
            },
            { call, put }
        ) {
            const result = yield call(Api, 'api/saveArticle', 'POST', {
                date,
                year,
                summary,
                type,
                time,
                title,
            });
            if (result.success) {
                yield put({
                    type: 'load',
                    payload: { reload: true },
                });
            }
            return result;
        },
        *updateArticle({ _id, _type, summary, title }, { call, put }) {
            const result = yield call(Api, 'api/updateArticleById', 'POST', {
                _id,
                type: _type,
                summary,
                title,
            });
            if (result.success) {
                yield put({
                    type: 'callUpdate',
                    _id,
                    _type,
                    summary,
                    title,
                });
            }
            return result;
        },
        *deleteArticle({ _id }, { call, put }) {
            const result = yield call(Api, 'api/deleteArticle', 'POST', {
                _id,
            });
            if (result.success) {
                yield put({
                    type: 'callDelete',
                    _id,
                });
            }
            return result;
        },
        *addViewer({ _id }, { call, put }) {
            const hasUpvote =
                JSON.parse(localStorage.getItem('hasUpvote')) || [];
            if (!hasUpvote.includes(_id)) {
                hasUpvote.push(_id);
                localStorage.setItem('hasUpvote', JSON.stringify(hasUpvote));
                yield call(Api, 'api/updateArticleViewerById', 'POST', { _id });
            }
            // yield put({
            //     _id,
            //     type: 'callAddViewer'
            // })
        },
        *load({ payload }, { call, put, select }) {
            const article = yield select(state => state.article.data);
            if (payload.reload || !article || article.length === 0) {
                const result = yield call(Api, 'api/getArticles');
                for (let item of result.data) item.show = true;
                yield put({
                    payload: result.success
                        ? JSON.stringify(result.data)
                        : result,
                    type: 'loadArticle',
                });
            }
            yield payload.cb && payload.cb();
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            // eslint-disable-line
            history.listen(location => {
                const { pathname } = location;
                if (pathname === '/article') {
                    dispatch({
                        type: 'filter',
                        payload: 'All',
                    });
                }
            });
        },
    },
};
