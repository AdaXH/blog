import { createStore, combineReducers } from 'redux'
import {
    isLoginReduce,
    logoReducer,
    loginUIREduce,
    asideReduce,
    allData,
    dialogReducer 
} from './reducersModule'

const reducers = combineReducers({
    user: isLoginReduce,
    logo: logoReducer,
    loginUI: loginUIREduce,
    aside: asideReduce,
    datas: allData,
    dialog: dialogReducer
})
export const Store = createStore(reducers, {})