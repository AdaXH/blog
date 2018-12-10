
export function asideReduce(state = 'hide', action) { //全局控制aside

    if (action.type === 'ASIDE') {
        return action.payload
    }
    return state
}

export function loginUIREduce(state = { type: 'login', status: 'hide' }, action) { //全局控制登陆UI的位置
    if (action.type === 'CHANGE') {
        return {
            ...action.payload
        }
    }
    return state
}

// const p = Promise.all([
//     API('/getDynamic'),
//     API('/getArticles'),
//     API('/getAllMessages')
// ]).then(result => {
//     if (result[0] instanceof Object && result[0].success) {
//         sessionStorage && sessionStorage.setItem('dynamics', JSON.stringify(result[0].data))
//     }
//     if (result[1] instanceof Object && result[0].success) {
//         sessionStorage && sessionStorage.setItem('articles', JSON.stringify(result[1].data))
//     }
//     if (result[2] instanceof Object && result[0].success) {
//         sessionStorage && sessionStorage.setItem('messages', JSON.stringify(result[2].data))
//     }
// })

// export function allData(state = p, action) {
//     if (sessionStorage && sessionStorage.getItem('dynamics') && sessionStorage.getItem('articles') && sessionStorage.getItem('messages')) {
//         const datas = {}
//         datas.dynamics = JSON.parse(sessionStorage.getItem('dynamics'))
//         datas.articles = JSON.parse(sessionStorage.getItem('articles'))
//         datas.messages = JSON.parse(sessionStorage.getItem('messages'))
//         if (action.type === 'SET_DATA') {
//             datas[action.payload.type] = action.payload.data
//         }
//         return datas
//     }
//     if (action.type === 'RESET') {
//         return p
//     }
//     return p
// }
const datas = {  //所有需要渲染的数据
    dynamics: [],
    articles: [],
    messages: [],
    avatars: []
}

export function allData(state = {}, action){  //更新数据
    if (action.type === 'SET_DATA'){
        window.debug() && console.log(action.payload.data)
        datas[action.payload.type] = action.payload.data
        return datas
    }
    if (action.type === 'UPDATE_DATA'){
        window.debug() && console.log(action.payload.data)
        for (let item of datas[action.payload.type]){
            if (item._id === action.payload.data._id){
                item.title = action.payload.data.title
                item.content = action.payload.data.content
                break
            }
        }
        return datas
    }
    return datas
}

export function dialogReducer(state = {}, action){  //封装通用组件调用时指定dialog的使用场景
    if (action.type === 'QUERY_DYNAMIC') { //编辑dynamic的场景
        if (action.payload._id){
            const dynamic = datas.dynamics.filter(item => item._id === action.payload._id)
            return {
                dynamic: { ...dynamic[0] },
                visible: true,
                cb: action.payload.cb,
                dialogType: 'editDynamic'
            }
        }
        if (!action.payload.visible) 
            return { visible: false }
    }
    if (action.type === 'NEW_DYNAMIC'){ //新增dynamic的场景
        return {
            dynamic: { },
            cb: action.payload.cb,
            placeholder: action.payload.placeholder,
            dialogType: 'newDynamic',
            visible: true
        }
    }
    if (action.type === 'LEAVE_MESSAGE'){ //留言、评论、回复场景
        return {
            dialogType: 'leaveMessage',
            visible: true,
            count: action.payload.count || 100,
            placeholder: action.payload.placeholder,
            cb: action.payload.cb,
            cancelCallback: action.payload.cancelCallback || undefined
        }
    }
    return { visible: false}
}

export function logoReducer(state = { src: 'home', item: '首页' }, action) {  //全局控制logo图标
    if (action.type === 'LOGO')
        return action.payload
    return state
}

export function isLoginReduce(state = { status: false, text: '登陆' }, action) {  //全局可取到的登录用户信息
    if (action.type === 'SET_USER_VO') {
        return {
            ...action.payload,
            status: true
        }
    }
    if (action.type === 'CLEAR_USER') {
        if (!!sessionStorage.getItem('user')) {
            const d = new Date(-1)
            document.cookie = 'user=' + sessionStorage.getItem('user') + ';path=/;expires=' + d
            sessionStorage.removeItem('user')
            return {
                status: false,
                text: '登陆'
            }
        }
    }
    return state
}