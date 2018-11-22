import React from 'react'
import './header.css'
import { SearchBar } from 'antd-mobile'
import { Icon } from 'antd'
import { connect } from 'react-redux';
const UI = props => {
    return(
        <header>
            <div className="logo">
            <span> <Icon style={{position:'relative', top:'-1px'}} type={props.logo.src}/> </span>
                Ada - {props.logo.item}
            </div>
            <SearchBar className='headerItem' placeholder="搜索" maxLength={8} />
        </header>
    )
}

export const Header = connect(state => {
    return {
        logo: state.logo
    }
}, () => { return { } })(UI)