export default {
    namespace: 'dialog',
    state: {
        visible: false,
        maxInput: 100,
        currentLength: 0,
        cb: data => console.log(data)
    },
    reducers: {
        renderInput(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        open(state, { payload }) {
            return {
                ...state,
                visible: true,
                ...payload
            };
        },
        hide(state, { payload }) {
            return {
                visible: false,
                maxInput: 100,
                currentLength: 0,
            };
        }
    }
};