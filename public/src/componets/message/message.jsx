import React from 'react'
import './message.css'
import { Card, Toast, WhiteSpace, Modal } from 'antd-mobile'
import { connect } from 'react-redux'
import { Icon } from 'antd'

// import { Base64 } from 'js-base64';
const prompt = Modal.prompt;
class UI extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            avatar: [],
            names: []
        }
    }
    shouldComponentUpdate() {
        if (arguments[1].data.length === 0) return false
        return true
    }
    componentDidMount() {
        Toast.loading('加载中...', 3)
        fetch('/getAllMessages', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            }
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if (result.success) {
                const names = []
                for (let item of result.data)
                    names.push(item.name)
                this.setState({
                    data: result.data,
                    names: [...new Set(names)]
                }, () => {
                    this.getAvatars()
                    Toast.hide()
                })
            } else {
                Toast.offline('网络繁忙' + result.errorMsg, 2)
            }
        }).catch(err => { Toast.offline(err, 2) })

    }
    getAvatars() {
        fetch('/all_user_avatar', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ name: this.state.names })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res
        }).then(result => {
            if (result.success) {
                this.setState({
                    avatar: result.data
                })
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
    sendMsg(value, _id, toRepeat) {
        if (!!_id) {
            // Toast.fail('这个接口还没写')   
            if (!value || value.trim() === '') {
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
            fetch('/repeatMsg', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    msg: {
                        info: escapeData(value),
                        name: this.props.user.name,
                        date: d,
                        toRepeat
                    }
                })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res.status
            }).then(result => {
                if (result && result.success) {
                    this.setState({
                        data: result.data.reverse()
                    }, () => Toast.hide())
                } else
                    Toast.offline(result && result.errorMsg || '网络繁忙' + result, 1)
            })
            return
        }
        if (!value || value.trim() === '') {
            Toast.fail('输入的不对', 2)
            return
        }
        function escapeData(data) {
            return data.replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL">/g, '').replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g, '').replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g, '**');;
        }
        Toast.loading('加载中...', 3)
        const msg = escapeData(value)
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
        fetch('/leaveMessage', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ date: d, content: msg, name })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if (result.success) {
                this.setState({
                    data: [...result.data].reverse()
                }, () => Toast.hide())
                Toast.loading('留言成功', 2)
            } else {
                Toast.fail(result.errorMsg)
            }
        }).catch(err => Toast.fail(err))
    }
    toggleRepeat(_id) {
        console.log(_id)
    }
    renderMsg(data, type) {
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
                                <div className="repeatStatus">{item.name} {item.date} 回复 {item.toRepeat}</div>
                            <div className="repeatText">{item.info}</div>
                        </div>
                                
                            )
                    })
    }
            </div >
}
return data && data.map(item => {
    return (
        <div className="messageItem" key={item._id}>
            <WhiteSpace />
            <Card >
                <Card.Header
                    title={<span><div style={{ paddingLeft: '7px' }}>{item.name}</div><div className='messageDate'>{item.date.replace(/-----/, ' ')}</div></span>}
                    thumb={this.setAvatar(item.name)}
                />
                <Card.Body>
                    <div style={{ color: '#7d7d7d', marginLeft: '53px', fontSize: '14px', lineHeight: '30px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>{item.content}</div>
                </Card.Body>
                <Card.Footer
                    extra={
                        <div className="messageOperationContainer" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px' }} onClick={() => this.toggleList(item._id)}>
                                <span style={{ position: 'relative', top: '1px' }}>{item.repeat.length || 0}</span>
                                <Icon style={{ position: 'relative', top: '0px', left: '4px' }} type='message' />
                            </div>
                            {<div style={{ fontSize: '12px' }} onClick={() => this.props.user.name ? prompt('', '你想对这条留言回复什么？', [
                                { text: '算了' },
                                { text: '发表', onPress: (value) => this.sendMsg(value, item._id, item.name) },
                            ], 'default', '') : Toast.fail('你还没有登录哦', 1)} >
                                <Icon style={{ position: 'relative', left: '-5px' }} type='plus' />

                            </div>
                            }
                        </div>} />
            </Card>
            {
                item.open && item.repeat && this.renderMsg(item.repeat, 'repeat')
            }
        </div>
    )
})
    }
render() {
    const els = document.querySelectorAll('.am-card-body')
    if (els.length !== 0) {
        const style = document.createElement('style');
        style.innerHTML = ".am-card-body::before{background:none !important} .am-card::before{border:none !important}"
        document.head.appendChild(style);
    }
    return (
        <div className="messageContainer">
            <div ref='_sendMsg' className="sendMsg" onClick={() =>
                this.props.user.name ?
                    (prompt('', '写下你的留言', [
                        { text: '算了' },
                        { text: '发表', onPress: (value) => this.sendMsg(value) },
                    ], 'default', ''),
                        toggleRotate(this.refs._sendMsg.children[0])
                    ) : Toast.fail('你还没有登陆', 1)} >
                <Icon className='sendMsgI' type='plus' />
            </div>
            {
                this.renderMsg(this.state.data)
            }
        </div>
    )
}
}
function toggleRotate(el) {
    el.style.transform = 'rotate(45deg)'
    const els = document.querySelectorAll('.am-modal-button')
    for (let item of els)
        item.addEventListener('click', () => {
            el.style.transform = 'rotate(0deg)'
        })

}
const Message = connect(state => {
    return {
        user: state.user
    }
}, () => {
    return {}
})(UI)
export default Message