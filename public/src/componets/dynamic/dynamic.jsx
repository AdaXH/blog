import React from 'react'
import { Card, Toast, WhiteSpace, Modal, PullToRefresh } from 'antd-mobile'
import { Icon } from 'antd'
import './dynamic.css'
import { connect } from 'react-redux'
import { API } from '../../request/request'
import { Base64 } from 'js-base64'
import ReactDOM from 'react-dom'
const alert = Modal.alert

class UI extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            height: document.documentElement.clientHeight,
            refreshing: false
        }
    }
    shouldComponentUpdate(arg1, arg2) {
        if (!arg2.data || arg2.data.length === 0) return false
        return true
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei
        }), 0);
        const { dynamics } = this.props
        if (dynamics.length === 0)
            this.props.history.push('/index')
        this.setState({
            data: dynamics
        })
    }
    refresh() {
        this.setState({ refreshing: true })
        API('/getDynamic').then(result => {
            if (result.success) {
                this.setState({ data: result.data }, () => this.setState({ refreshing: false }))
                this.props.setData({ payload: { type: 'dynamics', data: result.data } })
            }
            else Toast.offline('刷新失败', 1)
        })
    }
    toggleRepeat(_id) {
        const { data } = this.state
        for (let item of data) {
            if (item._id === _id) {
                item.open = !item.open
                break
            }
        }
        this.setState({ data: [...data] })
        this.props.setData({ payload: { type: 'dynamics', data } })
    }
    openDialog(_id) {
        const cb = value => {
            if (!value || value.content.trim() === '') {
                Toast.info('输入不规范', 1)
                return
            }
            Toast.loading('加载中...', 10)
            const d = new Date()
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()
            const hour = d.getHours()
            const minute = d.getMinutes()
            const currentDay = year + "-" + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '--' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
            API('/leave-dynamic-mg', 'POST', { msg: { context: value.content, date: currentDay }, _id, name: Base64.encode(this.props.user.name) }).then(res => {
                if (res.success) {
                    Toast.hide()
                    value.hide({ visible: false })
                    this.props.setData({ payload: { data: res.data, type: 'dynamics' } })
                    this.setState({ data: res.data.reverse() })
                }
                else Toast.offline(res)
            })
        }
        this.props.openDialog({ cb, placeholder: '你想评论什么呢？' })
    }
    deleteMsg(_id, msgId) {
        Toast.loading('删除中', 2)
        API('/deleteDynamicMsg', 'POST', { _id, msgId }).then(result => {
            Toast.hide()
            if (result.success) {
                const { data } = this.state
                for (let item of data) {
                    if (item._id === msgId) {
                        const msg = item.msg.filter(msg => msg._id !== _id)
                        item.msg = msg
                        break
                    }
                }
                this.setState({ data })
                this.props.setData({ payload: { type: 'dynamics', data } })
                Toast.success('已删除', 1)
            } else Toast.offline(result)
        })
    }
    render() {
        return (
            <div className="dynamicContainer">
                <div className="indexContainer contentSlideFromLeft">
                    <PullToRefresh refreshing={this.state.refreshing} damping={50} ref={el => this.ptr = el} style={{ height: this.state.height, overflow: 'auto' }} onRefresh={() => this.refresh()}>
                        {
                            this.state.data && this.state.data.length !== 0 && this.state.data.map(item => {
                                const len = (item.msg && item.msg.length) || 0
                                return (
                                    <div key={item._id}>
                                        <WhiteSpace />
                                        <Card className='itemFromLeft' >
                                            <Card.Header
                                                title={<div className="dynamicTitle"><div>{item.title}</div></div>}
                                            />
                                            <Card.Body>
                                                <div className='fromLeft' style={{ color: '#7d7d7d', fontSize: '14px', lineHeight: '30px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>{item.content}</div>
                                            </Card.Body>
                                            <Card.Footer content={<div className='dynamicOperationContainer'>
                                                <div className='dynamicDate fromLeft'>{item.date}</div>
                                                <div className="rightTemp">
                                                    <div className='upvote'><Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type="like" />{item.upvote}</div>

                                                    <div className="repeat">
                                                        <span onClick={() => this.toggleRepeat(item._id)} >
                                                            <Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type={item.open ? "close" : 'message'} />
                                                            {len}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            } />
                                            {
                                                item.open ?
                                                    <div className='repeatContainer' key={item._id}>
                                                        <div style={{ 'textAlign': "right", color: '#888', marginTop: '12px', paddingRight: '20px' }}>
                                                            <Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type="form" onClick={() => this.props.user.name ? this.openDialog(item._id) : Toast.fail('你还没有登录哦', 1)} />
                                                        </div>
                                                        <div className="repeatList">
                                                            <ul>
                                                                {
                                                                    item.msg && item.msg.reverse().map(msg => {
                                                                        return (
                                                                            <li key={msg._id}>
                                                                                <div className="name">
                                                                                    {msg.name || '神秘人'} : <span>{msg.date}</span>
                                                                                    {(this.props.user.admin || this.props.user.name === msg.name) && <Icon className='repeatInner deleteI' onClick={() => alert('提示', '确定删除吗？', [
                                                                                        { text: '取消', onPress: () => console.log('cancel') },
                                                                                        { text: '确定', onPress: () => this.deleteMsg(msg._id, item._id) }
                                                                                    ])} type='delete' />}
                                                                                </div>
                                                                                <div className="context">{msg.context}</div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    :
                                                    ''
                                            }

                                        </Card>

                                    </div>
                                )
                            })
                        }
                    </PullToRefresh>

                </div>

            </div>
        )
    }
}
const Dynamic = connect(state => {
    return {
        user: state.user,
        dynamics: state.datas.dynamics
    }
}, (dispatch) => {
    return {
        setUser(user) {
            dispatch({
                type: 'SET_USER_VO',
                payload: user
            })
        },
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        },
        openDialog(payload) {
            dispatch({ type: 'LEAVE_MESSAGE', payload })
        }
    }
})(UI)
export default Dynamic