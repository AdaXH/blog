import React from 'react'
import './message.css'
import { Card, Toast, WhiteSpace, Modal, PullToRefresh } from 'antd-mobile'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { API } from '../../request/request'
import ReactDOM from 'react-dom'

const alert = Modal.alert;
export class _UI extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            avatar: [],
            names: [],
            height: document.documentElement.clientHeight,
            refreshing: false         
        }
    }
    shouldComponentUpdate(arg1, arg2) {
        if (arg2.data.length === 0) return false
        return true
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei
        }), 0);
        const { messages } = this.props
        if (messages.length === 0)
            this.props.history.push('/index')
        const names = []
        for (let item of messages)
            names.push(item.name)
        this.setState({
            names: [...new Set(names)],
            data: messages
        }, () => {
            this.getAvatars()
            Toast.hide()
        })
    }
    refresh() {
        this.setState({ refreshing: true })
        API('/getAllMessages').then(result => {
            if (result.success) {
                this.setState({ data: result.data })
                this.props.setData({ payload: { type: 'messages', data: result.data } })
                const names = []
                for (let item of result.data)
                    names.push(item.name)
                this.setState({
                    names: [...new Set(names)],
                }, () => {
                    this.getAvatars(() => this.setState({ refreshing: false }))
                })
            }
            else Toast.offline('刷新失败', 1)
        })
    }
    getAvatars(cb) {
        API('/all_user_avatar', 'POST', { name: this.state.names }).then(result => {
            if (result.success) {
                this.props.setData({ payload: { type: 'avatars', data: result.data } })
                this.setState({ avatar: result.data }, cb && cb())
            }
        })
    }
    setAvatar(name) {
        for (let item of this.state.avatar)
            if (name === item.name)
                return item.avatar
        return ''
    }
    toggleList(_id) {
        const { data } = this.state
        for (let item of data)
            if (item._id === _id)
                item.open = !item.open
        this.setState({
            data: [...data]
        })
    }
    handleRepeat(item, _id, placeholder) {
        if (this.props.user.name === item.name) {
            Toast.offline('自己回复自己不太好吧？', 2)
            return
        }
        this.openDialog(_id, item.name, placeholder)
    }
    deleteMsg(_id, type, _parent_id) {
        console.log(_id)
        Toast.loading('正在删除', 10)
        if (type === 'outer') {
            API('/deleteMsgById', 'POST', { _id }).then(result => {
                Toast.hide()
                if (result.success) {
                    const data = this.state.data.filter(item => item._id !== _id)
                    this.setState({ data })
                    this.props.setData({ payload: { type: 'messages', data } })
                    Toast.success('已删除', 2)
                } else Toast(result)
            })
        }
        else if (type === 'inner') {
            API('/deleteInnerRepeat', 'POST', { _id, _parent_id, name: this.props.user.name }).then(result => {
                Toast.hide()
                if (result.success) {
                    const { data } = this.state
                    for (let item of data) {
                        if (item._id === _parent_id) {
                            const repeat = item.repeat.filter(msg => msg._id !== _id)
                            item.repeat = repeat
                            break
                        }
                    }
                    this.setState({ data })
                    this.props.setData({ payload: { type: 'messages', data } })
                    Toast.success('已删除', 2)
                } else Toast(result)
            })
        }
    }
    renderMsg(data, type, _parent_id) {
        if (type === 'repeat') {
            if (data.length === 0)
                return (
                    <div style={{ lineHeight: '20px' }} className="repeatItemContainer">
                        还没有人回复哦
                    </div>
                )
            return <div className="repeatItemContainer"  >
                <div className="dot"></div>
                {
                    data && data.map(item => {
                        return (
                            <div className="repeatItem" key={item._id}>
                                <div className="repeatStatus">
                                    <span>{item.name} {item.date} @ {item.toRepeat}</span>
                                    <Icon className='repeatInner' onClick={() => this.handleRepeat(item, _parent_id, item.name)} type='plus'></Icon>
                                    {
                                        (this.props.user.admin || this.props.user.name === item.name) &&
                                        <Icon style={{ marginRight: '46px' }} className='repeatInner deleteI' onClick={() => alert('提示', '确定删除吗？', [
                                            { text: '取消', onPress: () => console.log('cancel') },
                                            { text: '确定', onPress: () => this.deleteMsg(item._id, 'inner', _parent_id) }
                                        ])} type='delete' />}
                                </div>
                                <div className="repeatText">{item.info}</div>
                            </div>

                        )
                    })
                }
            </div>
        }
        return data && data.map(item => {
            return (
                <div className="messageItem itemFromLeft" key={item._id}>
                    <WhiteSpace />
                    <Card >
                        <Card.Header
                            className=''
                            title={<span><div style={{ paddingLeft: '7px' }}>{item.name}</div><div className='messageDate'>{item.date.replace(/-----/, ' ')}</div></span>}
                            thumb={this.setAvatar(item.name)}
                        />
                        <Card.Body className=''>
                            <div style={{ color: '#7d7d7d', marginLeft: '53px', fontSize: '14px', lineHeight: '30px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>{item.content}</div>
                        </Card.Body>
                        <Card.Footer
                            className=''
                            extra={
                                <div className="messageOperationContainer" style={{ textAlign: 'center' }}>
                                    {(this.props.user.admin || this.props.user.name === item.name) &&
                                        <div onClick={() => alert('提示', '确定删除吗？', [
                                            { text: '取消', onPress: () => console.log('cancel') },
                                            { text: '确定', onPress: () => this.deleteMsg(item._id, 'outer') }
                                        ])}>
                                            <Icon className='deleteI' style={{ position: 'relative', top: '-2px' }} type='delete' />
                                        </div>
                                    }
                                    <div style={{ fontSize: '12px' }} onClick={() => this.toggleList(item._id)}>
                                        <span style={{ paddingRight: '5px' }}>{item.repeat.length || 0}</span>
                                        <Icon type='message' />
                                    </div>
                                    {<div style={{ fontSize: '12px' }} onClick={() => this.props.user.name ? this.openDialog(item._id, this.props.user.name === item.name ? null : item.name, this.props.user.name === item.name ? '你想补充什么呢' : item.name) : Toast.fail('你还没有登录哦', 1)} >
                                        <Icon type='plus' />
                                    </div>
                                    }
                                </div>} />
                    </Card>
                    {
                        item.open && item.repeat && this.renderMsg(item.repeat.reverse(), 'repeat', item._id)
                    }
                </div>
            )
        })
    }
    openDialog(_id, toRepeat, placeholder) {
        if (!!_id) {  //回复
            const cb = data => {
                window.debug() && console.log(data.content)
                if (!data.content || data.content.trim() === '') {
                    Toast.fail('输入不规范', 1)
                    return
                }
                let date = new Date()
                let minute = date.getMinutes()
                const m = minute < 10 ? minute + 1 : '0' + minute
                let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
                let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
                let year = date.getFullYear()
                let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
                let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
                let d = year + '/' + month + '/' + day + ' ' + hour + ':' + m + ':' + seconds
                Toast.loading('加载中', 1)
                API('/repeatMsg', 'POST', {
                    _id,
                    msg: {
                        info: escapeData(data.content),
                        name: this.props.user.name,
                        date: d,
                        toRepeat
                    }
                }).then(result => {
                    if (result.success) {
                        this.getAvatars()
                        data.hide({ visible: false })
                        this.setState({ data: result.data.reverse() }, () => Toast.loading('操作成功', 1))
                        this.props.setData({ payload: { type: 'messages', data: result.data } })
                    }
                    else Toast.offline(result)
                })
                return
            }
            this.props.openDialog({ count: 180, cb, placeholder: toRepeat === null ? '你想对自己补充点什么呢' : '在这里写下回复 ' + placeholder + ' 的话' })
            return
        }
        //留言
        this.refs._sendMsg.children[0].style.transform = 'rotate(45deg)'
        const cb = data => {
            window.debug() && console.log(data)
            if (!data.content || data.content.trim() === '') {
                Toast.offline('输入不规范', 1)
                return
            }
            Toast.loading('加载中...', 3)
            const msg = escapeData(data.content)
            const name = this.props.user.name
            let date = new Date()
            let minute = date.getMinutes()
            const m = minute < 10 ? '0' + minute : minute
            let hour = date.getHours()
            const h = hour < 10 ? '0' + hour : hour
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            const ms = month < 10 ? '0' + month : month
            let day = date.getDate()
            const _day = day < 10 ? '0' + day : day
            let d = year + '-' + ms + '-' + _day + '-----' + h + ' : ' + m
            API('/leaveMessage', 'POST', { date: d, content: msg, name }).then(result => {
                if (result.success) {
                    this.refs._sendMsg.children[0].style.transform = 'rotate(0deg)'
                    this.setState({ data: [...result.data.reverse()] }, () => Toast.loading('成功啦', 1))
                    this.props.setData({ payload: { type: 'messages', data: result.data } })
                    data.hide({ visible: false })
                } else Toast.offline(result)
            })
        }
        this.props.openDialog({ count: 180, cb, placeholder: '在这里写下你的留言...', cancelCallback: () => this.refs._sendMsg.children[0].style.transform = 'rotate(0deg)' })
    }
    render() {

        setTimeout(() => {
            const els = document.getElementsByClassName('messageItem')
            for (let i = 0; i < els.length; i++)
                els[i].style['animation-delay'] = `${i / 4}s`
        }, 0);

        return (
            <div className="messageContainer ">
                <div ref='_sendMsg' className="sendMsg" onClick={() =>
                    this.props.user.name ?
                        (this.openDialog(),
                            toggleRotate(this.refs._sendMsg.children[0])
                        ) : Toast.fail('你还没有登陆', 1)} >
                    <Icon className='sendMsgI' type='plus' />
                </div>
                <PullToRefresh refreshing={this.state.refreshing} damping={50} ref={el => this.ptr = el} style={{ height: this.state.height, overflow: 'auto' }} onRefresh={() => this.refresh()}>
                    {
                        this.renderMsg(this.state.data)
                    }
                </PullToRefresh>
            </div>
        )
    }
}

function escapeData(data) {
    return data.replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g, '').replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g, '**');
}
function toggleRotate(el) {
    el.style.transform = 'rotate(45deg)'
    const els = document.querySelectorAll('.am-modal-button')
    for (let item of els)
        item.addEventListener('click', () => {
            el.style.transform = 'rotate(0deg)'
        })

}
export const Message = connect(state => {
    return {
        user: state.user,
        messages: state.datas.messages,
        avatars: state.datas.avatars
    }
}, (dispatch) => {
    return {
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        },
        openDialog(payload) {
            dispatch({ type: 'LEAVE_MESSAGE', payload })
        }
    }
})(_UI)