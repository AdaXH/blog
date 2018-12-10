import React from 'react'
import './about.css'
import ReactHtmlParser from 'react-html-parser'
import { Icon } from 'antd'
export class About extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            html: ``,
            text: '',
            show: false
        }
    }
    componentDidMount() {
        const start = `请允许我先用代码自我介绍一下：
export const renderMyself = props => {
 return(
    <div>
     <p>姓名：向晗</p>
    /*等等文字太暗看不到*/ => color:white
    /*再往左边靠*/ => text-align:left
    /*好像有点小拥挤？*/=> padding:10px
     <p>性别：男</p> /*废话*/
    /*文字出现的太普通了，写个动画吧，animation */
     <p>爱好：妹子</P> /*...不对，写错了*
     <p>爱好: code </p> /*嗯，是的没错*/
    /*再来个旋转试试， transform 3d*/
     <p>年龄：22</p>/*真没装嫩*/
     <p>技能：HTML，CSS3，ES6-7-8，Node，React...</p>
    /*我自己都信了(我怎么不加上吹牛p呢)*/
    /*再来一个交互吧？*/
     <Icon type='redo' onClick={ () => {
       /className/.test(el.className) ? 
       el.className = someClassName : 
       el.className = anotherClassName 
    }}/> /* 好了，试一下点击那个图标能不能toggle这个类*/
    </div>
    )
}`
        for (let i = 0; i < start.length; i++) {
            window.debug() && console.log(i, start[i])
            setTimeout(() => {
                if (i === 90) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView1'><p>姓名：向晗</p></div>`
                    })
                }
                if (i === 123) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2'><p>姓名：向晗</p></div>`
                    })
                }
                if (i === 156) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3'><p>姓名：向晗</p></div>`
                    })
                }
                if (i === 188) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3 _topView4'><p>姓名：向晗</p></div>`
                    })
                }
                if (i === 211) {
                    if (document.getElementsByClassName('Scrool')[0]) {
                        document.getElementsByClassName('Scrool')[0].style.transform = 'translateX(-50%) translateY(-162px)'
                    }
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p class=''>性别：男</p>
                            </div>`
                    })
                }
                if (i === 261) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p class=''>性别：男</p>
                                <p class='itemFromRight'>爱好：妹子</P>
                            </div>`
                    })
                }
                //
                if (i === 278) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p class=''>性别：男</p>
                                <p style='text-decoration:line-through' class='itemFromRight'>爱好：妹子</P>
                            </div>`
                    })
                }
                if (i === 309) {
                    this.setState({
                        html: `<div ref='_ref' class='_topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p>性别：男</p>
                                <p class='itemFromRight' style='text-decoration:line-through'>爱好：妹子</P>
                                <p class='itemFromRight'>爱好：code</P>
                            </div>`
                    })
                }
                if (i === 340) {
                    this.setState({
                        html: `<div ref='_ref' class='_topViewRotate _topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p>性别：男</p>
                                <p class='itemFromRight' style='text-decoration:line-through'>爱好：妹子</P>
                                <p class='itemFromRight'>爱好：code</P>
                            </div>`
                    })
                }
                if (i === 367) {
                    this.setState({
                        html: `<div ref='_ref' class='_topViewRotate _topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p>性别：男</p>
                                <p class='itemFromRight' style='text-decoration:line-through'>爱好：妹子</P>
                                <p class='itemFromRight'>爱好：code</P>
                                <p class='itemFromRight'>年龄：22</P>
                            </div>`
                    })
                }
                if (i === 441) {
                    this.setState({
                        html: `<div ref='_ref' class='_topViewRotate _topView2 _topView3 _topView4'>
                                <p>姓名：向晗</p>
                                <p>性别：男</p>
                                <p class='itemFromRight' style='text-decoration:line-through'>爱好：妹子</P>
                                <p class='itemFromRight'>爱好：code</P>
                                <p class='itemFromRight'>年龄：22</P>
                                <p class='itemFromRight'>技能：HTML，CSS3，ES6-7-8，Node，React...</p>
                            </div>`
                    })
                }
                if (i === 450) {
                    if (document.getElementsByClassName('Scrool')[0]) {
                        document.getElementsByClassName('Scrool')[0].style.transform = 'translateX(-50%) translateY(-315px)'
                    }
                }
                if (i === 651) {
                    this.setState({ show: true })
                }
                this.setState({
                    text: this.state.text + start[i]
                })
            }, i * 100)
        }
    }
    toggleStatus() {
        if (this.refs._ref) {
            const el = document.getElementsByClassName('_topView2')[0]
            if (el){
            (/toggleStatus/.test(el.className)) ? (el.className = el.className.replace(/toggleStatus/, ' ')) : (el.className += ' toggleStatus ')
        }}

    }
    render() {
        return (
            <div className="aboutContainer">
                <div ref='ref' className="diyView contentSlideFromLeft">
                    {
                        this.state.show && <Icon onClick={() => this.toggleStatus()} className='togleStatus' type="redo" />
                    }
                    {
                        ReactHtmlParser(this.state.html)
                    }
                </div>
                <div className="inputText contentSlideFromRight">
                    <div className="Scrool">
                        {
                            this.state.text
                        }
                    </div>

                </div>
            </div>
        )
    }
}