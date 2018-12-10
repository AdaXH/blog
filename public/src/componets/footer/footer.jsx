import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from 'antd'
import './footer.css'
import { connect } from 'react-redux';
const UI = props => {
    const nav = [
        {
            type: 'fund',
            text: '动态',
            url: '/dynamic'
        },
        {
            type: 'file-text',
            text: '文章',
            url: '/article'
        },
        {
            type: 'home',
            text: '首页',
            url: '/index'
        },
        {
            type: 'message',
            text: '留言',
            url: '/message'
        },
        {
            type: 'tag',
            text: '关于',
            url: '/about'
        }
    ]
    return (
        <footer style={{ background: props.type === 'home' ? "#22282c" : '' }}>
            <ul>
                {
                    nav.map(item => {
                        return (
                            <li key={item.url} onClick={() => props.set(item.type, item.text)}>
                                <NavLink style={{ display:'block', color: props.type === 'home' ? "white" : '' }} to={item.url}>
                                    <Icon type={item.type} />
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>
        </footer>
    )
}
export const Footer = connect(state => {
    return {
        type: state.logo.src
    }
}, dispatch => {
    return {
        set(src, item) {
            dispatch({ type: 'LOGO', payload: { src, item } })
        }
    }
})(UI)