import React from 'react'
import './container.css'
import { Footer } from './../footer/footer'
import { Header } from './../header/header'
import { RouteConfig } from './../route/route'
import { Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import Aside from './../aside/Aside'
import { LoginReg } from '../aside/loginrReg'
import { Base64 } from 'js-base64'
import { API } from '../../request/request'
import { Icon } from 'antd'

class UI extends React.PureComponent {
    componentDidMount() {
        const { datas } = this.props
        const apiUrl = [
            {
                key: 'dynamics',
                value: '/getDynamic'
            },
            {
                key: 'articles',
                value: '/getArticles'
            },
            {
                key: 'messages',
                value: '/getAllMessages'
            }
        ]
        for (let key in datas) {
            if (datas[key].length === 0 && key !== 'avatars') {
                const url = apiUrl.filter(item => item.key === key)
                API(url[0].value).then(result => {
                    result.success && this.props.setData({ payload: { type: key, data: result.data } })
                })
            }
        }
        if (sessionStorage && !!sessionStorage.getItem('user')) {
            API('/getUserInfor', 'POST', { name: Base64.decode(sessionStorage.getItem('user')) }).then(result => {
                result.success ? this.props.userInfo({ ...result.user, status: true, text: '注销' }) : Toast.offline(result.errorMsg || result, 1)
            })
        }
        const con = document.getElementsByClassName('container')[0]
        con.style.height = window.innerHeight + 'px'
        window.addEventListener('resize', () => con.style.height = window.innerHeight + 'px')
    }
    refresh(){
        console.log(window.location.pathname)

    }
    render() {
        return (
            <div className='container'>            
                <div className="galleryContainer">  {/* 图库画布 */}
                    <Icon type='export' className='exitGallery' onClick={() => {
                        document.getElementsByClassName('galleryContainer')[0].style.transform = 'translateX(100%)'
                    }} />
                    <canvas id="canvas">你的浏览器不支持HTML5画布技术，请使用谷歌浏览器。</canvas>
                </div>
                <LoginReg />      {/* 登陆注册 */}
                <Aside />         {/* 侧边栏 */}
                <Header />        {/* 头部 */}
                <RouteConfig />   {/* 路由配置 */}
                <Footer />        {/* 底部 */}
            </div>
        )
    }
}
export
    const Container = connect(state => {
        return {
            user: state.user,
            datas: state.datas,
            visible: state.dialog.visible
        }
    }, dispatch => {
        return {
            setData(params) {
                dispatch({ type: 'SET_DATA', ...params })
            },
            userInfo(user) {
                dispatch({ type: 'SET_USER_VO', payload: { ...user } })
            },
        }
    })(UI)