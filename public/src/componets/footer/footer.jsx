import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from 'antd'
import './footer.css'
import { connect } from 'react-redux';
const UI = props => {
    return(
        <footer>
            <ul>
                <li>
                    <div>
                        <NavLink to='/index' onClick={() => props.set('home', '首页')}><Icon type="home" />首页</NavLink> 
                        
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to='/article' onClick={() => props.set('file-text', '文章')}><Icon type="file-text" />文章</NavLink> 
                        
                    </div>
                    
                </li>
                <li>
                    <div>
                        <NavLink to='/message' onClick={() => props.set('message', '留言')}><Icon type="message" />留言板</NavLink> 
                        
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to='/about' onClick={() => props.set('tag', '关于')}><Icon type="tag" />关于</NavLink> 
                        
                    </div>
                </li>
            </ul>
        </footer>
    )
}
export const Footer = connect(state => {
    return { }
}, dispatch => {
    return {
        set(src, item){
            dispatch({ type: 'LOGO', payload: { src, item } })
        }
    }
})(UI)