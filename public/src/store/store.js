import { createStore, combineReducers } from 'redux'
const reducers = combineReducers({
    user: isLoginReduce,
    logo: logoReducer,
    loginUI: loginUIREduce,
    aside: asideReduce
})

function asideReduce(state = 'hide', action){
    if (action.type === 'ASIDE'){
        return action.payload
    }
    return state
}

function loginUIREduce(state = { type: 'login', status: 'hide' }, action){
    if (action.type === 'CHANGE'){
        return {
            ...action.payload
        }
    }
    return state
}

function logoReducer(state = { src: 'home', item: '首页' }, action) {
    if (action.type === 'LOGO')
        return action.payload
    return state
}

function isLoginReduce(state =  { status: false, text: '登陆' }, action){
    if (action.type === 'SET_USER_VO'){
        return {
            ...action.payload,
            status: true
        }
    }
    if (action.type === 'CLEAR_USER'){
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

// function getUserInfor(){
//   return new Promise((resolve, reject) => {
//       fetch('/getUserInfor', {
//           method: 'POST',
//           headers: {
//               'content-type': 'application/json',
//               accept: 'applciation/json'
//           },
//           body: JSON.stringify({ name: Base64.decode(sessionStorage.getItem('user')) })
//       }).then(res => {
//           if (res.status >= 200 && res.status < 300) return res.json()
//           return res.status
//        }).then(result => {
//            if (result.success) resolve(result.user)
//            else reject(result.errorMsg || result)
//        }).catch(err => reject(err))
//   })  
// }

export const Store = createStore(reducers, {})