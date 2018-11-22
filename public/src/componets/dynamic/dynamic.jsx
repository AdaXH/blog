import React from 'react'
import { Card, Toast, WhiteSpace, Modal } from 'antd-mobile'
import { Icon } from 'antd'
import './dynamic.css'
import { connect } from 'react-redux';
import { Base64 } from 'js-base64'
const prompt = Modal.prompt;
function offline(err) {
    Toast.offline(err + '!!!', 3);
}

// function random() {
//     const icons = ['heart', 'eye', 'filter', 'bell', 'shake', 'fire', 'robot', 'meh', 'frown']
//     return icons[Math.floor(Math.random() * icons.length)]
// }
class UI extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            time: 10,
            modal: false
        }
    }
    loadingToast() {
        Toast.loading('加载中...', this.state.time, () => {
        });
    }
    componentDidMount() {
        const style = document.createElement('style');
        style.innerHTML = ".am-card-body::before{background:none !important} .am-card::before{border:none !important}"
        document.head.appendChild(style);
        this.loadingToast()
        fetch('/getDynamic', {
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
            Toast.hide()
            this.setState({
                time: 0
            })
            result.success ?
                this.setState({
                    data: result.data
                })
                :
                offline(result.errorMsg || '网络繁忙' + result)
        })
    }
    toggleRepeat(_id) {
        const { data } = this.state
        for (let item of data) {
            if (item._id === _id) {
                item.open ? item.open = false : item.open = true
                break
            }
        }
        this.setState({ data: [...data] })
    }
    sendRepeat(value, _id) {
        if (!value || value.trim() === '') {
            Toast.info('输入不规范', 1)
            return
        }
        if (value.length > 100) {
            Toast.info('少说两句，太长了', 3)
            return
        }
        Toast.loading('加载中...', this.state.time, () => {
        });
        const d = new Date()
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const day = d.getDate()
        const hour = d.getHours()
        const minute = d.getMinutes()
        const currentDay = year + "-" + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '--' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
        fetch('/leave-dynamic-mg', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id, msg: { context: value, date: currentDay }, name: Base64.encode(this.props.user.name) })
        }).then(res => { Toast.hide(); return res.json() }).then(result => {

            if (result.success) {
                this.setState({
                    data: result.data.reverse()
                }, () => Toast.hide())
            }
        })
    }
    render() {
        return (
            <div className="dynamicContainer">
                {
                    this.state.data &&
                    this.state.data.length !== 0 &&
                    this.state.data.map(item => {
                        const len = (item.msg && item.msg.length) || 0
                        return (
                            <div key={item._id}>
                                <WhiteSpace />
                                <Card >
                                    <Card.Header
                                        title={<div className="dynamicTitle"><div>{item.title}</div></div>}
                                    />
                                    <Card.Body>
                                        <div style={{ color: '#7d7d7d', fontSize: '14px', lineHeight: '30px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>{item.content}</div>
                                    </Card.Body>
                                    <Card.Footer content={<div className='dynamicOperationContainer'>
                                        <div className='dynamicDate'>{item.date}</div>  
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
                                                    <Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type="form" onClick={() => this.props.user.name ? prompt('', '写下你的评论', [
                                                        { text: '算了' },
                                                        { text: '评论', onPress: (value) => this.sendRepeat(value, item._id) },
                                                    ], 'default', '') : Toast.fail('你还没有登录哦', 1)} />
                                                </div>
                                                <div className="repeatList">
                                                    <ul>
                                                        {
                                                            item.msg && item.msg.reverse().map(msg => {
                                                                return (
                                                                    <li key={msg._id}>
                                                                        <div className="name">{msg.name || '神秘人'} : <span>{msg.date}</span></div>
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
            </div>
        )
    }
}
const Dynamic = connect(state => {
    return {
        user: state.user
    }
}, (dispatch) => {
    return {
        setUser(user) {
            dispatch({
                type: 'SET_USER_VO',
                payload: user
            })
        }
    }
})(UI)
export default Dynamic