import React from 'react'
import './container.css'
import { Footer } from './../footer/footer'
import { Header } from './../header/header'
import { View } from './../view/view'
import { NoticeBar } from 'antd-mobile'
import { connect } from 'react-redux'
import Login from './../login/login'
import { LoginReg } from '../login/loginrReg';
class UI extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount(){
        const con = document.getElementsByClassName('container')[0]
        con.style.height = window.innerHeight + 'px'
        window.addEventListener('resize', () => {
            con.style.height = window.innerHeight + 'px'
        })
    }
    render() {
        return (
            <div className='container'>
                <LoginReg />
                <Login />
                { !this.props.user.name && <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable" action={<span style={{ color: '#a1a1a1' }}>不再提示</span>}>
                    移动端with React，没有pc的效果，移动端仍在测试，完整交互在pc端`
                    </NoticeBar>
                }
                
                <Header />
                <View />
                <Footer />
            </div>
        )
    }
}
export
    const Container = connect(state => {
        return {
            user: state.user
        }
    }, () => {
        return {}
    })(UI)