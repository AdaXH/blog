import React from 'react'
import './login.css'
import { Icon, Upload } from 'antd';
import { Modal, Toast } from 'antd-mobile'
import { Base64 } from 'js-base64'
import { connect } from 'react-redux'
const prompt = Modal.prompt
class UI extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            aside: false,
            status: '登陆',
            user: {},
            avatar: ''
        }
    }
    toggleAside() {
        this.setState({
            aside: !this.state.aside
        })
    }
    loginOrRegister(type) {
        if (this.props.user.text === '注销' && type !== 'register'){
            this.props.logoOut()
            return
        } 
        // this.props.asideFn('open')
        this.props.toggleUI(type, 'open')
        this.toggleAside()
    }
    componentWillMount() {
        if (/user/.test(document.cookie)) {
            const arr = document.cookie.split('&')
            let cookies = []
            for (let item of arr) {
                cookies = item.split('=')
                if (cookies[0] === 'user') {
                    sessionStorage && sessionStorage.setItem('user', cookies[1])
                    break
                }
            }
        }
    }
    componentDidMount(){
        const con = document.getElementsByClassName('loginRegContainer')[0]
        con.style.height = window.innerHeight + 'px'
        window.addEventListener('resize', () => {
            con.style.height = window.innerHeight + 'px'
        })
        if (!this.props.user.status)
            this.getUserInfo(this.props.user.name)
    }
    getUserInfo(name) {
        fetch('/getUserInfor', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'applciation/json'
            },
            body: JSON.stringify({ name: name || Base64.decode(sessionStorage.getItem('user')) })
        }).then(res => {
            if (res.status >= 200 && res.status < 300) return res.json()
            return res.status
        }).then(result => {
            if (result.success) {
                // this.setState({ avatar: result.user.avatar })
                this.props.userInfo({...result.user, status: true,  text: '注销'})
            }
            else Toast.offline(result.errorMsg || result, 1)
        }).catch(err => Toast.offline(err, 1))
    }
    handleUpload(info) {
        const file = info.nativeEvent.target.files[0]
        handleFile.call(this, file)
    }
    shareToSina() {
        const title = '个人主页'
        const pic = "http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u5cwpsj211y0hltn0.jpg";
        (function (s, d, e) { try { } catch (e) { } var f = 'http://v.t.sina.com.cn/share/share.php?', u = d.location.href, p = ['url=', e(u), '&title=', e(title), '&appkey=2924220432', '&pic=', e(pic)].join(''); function a() { if (!window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=620,height=450,left=', (s.width - 620) / 2, ',top=', (s.height - 450) / 2].join(''))) u.href = [f, p].join(''); }; if (/Firefox/.test(navigator.userAgent)) { setTimeout(a, 0) } else { a() } })(window.innerWidth, document, encodeURIComponent);
    }
    render() {
        console.log(this.props)
        return (
            <div className={this.state.aside ? "loginContainer asideToggle" : 'loginContainer'}>
                
                <div className="entrySwitch" onClick={() => this.toggleAside()}>
                    <Icon type='right' className={this.state.aside ? 'toggle' : ''} />
                </div>
                <div className="leftContainer">
                    <div className="avatarContainer">
                        {
                            this.props.user.name && <div className="upload">
                                <input type='file' onChange={(info) => this.handleUpload(info)}>
                                </input>
                            </div>
                        }
                        <img src={(this.props.user.avatar ? this.props.user.avatar : '/upload/user_avatar/IMG_0039.GIF')} alt="" />
                        <span className="userName">
                            {
                                this.props.user.name || 'Ada'
                            }</span>
                    </div>
                    <div className="operationListContainer">
                        <ul className="operationList">
                            <li onClick={() => this.loginOrRegister('login')} className="operationItem">
                                <span>
                                    <Icon type="user" />
                                </span>
                                {this.props.user.text}
                            </li>
                            <li onClick={() => this.loginOrRegister('register')} className="operationItem">
                                <span>
                                    <Icon type="user-add" />
                                </span>
                                注册
                        </li>
                            <li className="operationItem">
                                <a style={{ color: '#504e4e' }} href="https://github.com/adaxh">
                                    <span>
                                        <Icon type="github" />
                                    </span>
                                    github
                                </a>
                            </li>
                            <li className="operationItem" onClick={() => this.shareToSina()}>
                                <span>
                                    <Icon type="weibo-circle" />
                                </span>
                                分享到微博
                        </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
const Login = connect(state => {
    return {
        user: state.user,
        aside: state.aside
    }
}, dispatch => {
    return {
        userInfo(user) {
            dispatch({ type: 'SET_USER_VO', payload: { ...user } })
        },
        asideFn(status){
            dispatch({ type: 'ASIDE', payload:  status })
        },
        logoOut() {
            dispatch({ type: 'CLEAR_USER' })
        },
        toggleUI(type, status) {
            dispatch({ type: 'CHANGE', payload: { type, status } })
        }
    }
})(UI)

function handleFile(file) {
    const { name } = file
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)){
        Toast.fail('不支持的图片类型', 1)
        return
    }
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload = e => {
        fetch('/set-avatar',
            {
                method: 'POST',
                body: JSON.stringify({ avatar: e.target.result, name: this.props.user.name, fileName: name }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status <= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                if (data && data.success) {
                        this.props.userInfo({ ...this.props.user, avatar: `/upload/user_avatar/${ name }`})
                        Toast.success('更新头像成功', 1)
                }else
                    Toast.fail(data && data.errorMsg || '网络出错 ' + data.status)
            })
        }
}
export default Login