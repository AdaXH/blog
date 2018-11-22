import React from 'react'
import {  Popover, Toast } from 'antd-mobile'
import { Icon } from 'antd'
import './article.css'
import ReactHtmlParser from 'react-html-parser';
const Item = Popover.Item
export class Article extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            data: []
        }
    }
    componentDidCatch(err, info){
        
    }
    componentDidMount() {
        for (let item of document.querySelectorAll('.ql-editor'))
            item.contenteditable = false
        Toast.loading('加载中...', 30);
        fetch('/getArticles', {
            method: 'get',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            }
        }).then(res => {
            if (res.status >= 200 && res.status < 300) return res.json()
            return res.status
        }).then(result => {
            if (result.success) {
                this.setState({
                    data: result.data
                }, () => Toast.hide())
            } else Toast.offline(result.errorMsg + '!!!', 3);
        }).catch(err => Toast.offline(err + '!!!', 3))
    }
    onSelect(key) {
        const _id = key.props.value
        if (key.key === '4'){
            this.props.history.push('/article' + _id)
        }
    }
    render() {
        return (
            <div className='articleContainer'>
                <ul className="articleList">
                    {
                        this.state.data && this.state.data.map(item => {
                            return (
                                <li  key={item._id} className="articleItem">
                                    <div className="articleStatus">
                                        <div>
                                            <Icon style={{ position: 'relative', right:'2px',top: '-1px' }} type="clock-circle" /><span style={{ fontSize: '12px' }}>{item.date}</span>
                                        </div>
                                        
                                        <div>
                                            <Icon style={{position:'relative',top:'-1px'}} type='like'/><span style={{marginLeft:'4px'}}>{item.viewer}</span>
                                        </div>
                                        <div>
                                            <Icon style={{ position: 'relative', top: '-1px' }} type='tag' /><span style={{ marginLeft: '4px' }}>{item.type}</span>
                                        </div>
                                        <div className="operation">
                                        <Popover mask
                                            overlayClassName="fortest"
                                            overlayStyle={{ color: 'currentColor' }}
                                            visible={this.state.visible}
                                            overlay={[
                                                (<Item key="4" value={item._id} data-seed="logId">查看详情</Item>),
                                                (<Item key="5" value={item._id} style={{ whiteSpace: 'nowrap' }}>点个赞</Item>),
                                                (<Item key="6" value={item._id} >
                                                    <span style={{ marginRight: 5 }}>分享</span>
                                                </Item>),
                                            ]}
                                            align={{
                                                overflow: { adjustY: 0, adjustX: 0 },
                                                offset: [-10, 0],
                                            }}
                                            onVisibleChange={this.handleVisibleChange}
                                            onSelect={(key) => this.onSelect(key)}
                                        >
                                            <div
                                            >
                                                more
                                            </div>
                                        </Popover>
                                    </div>
                                    </div>
                                    
                                    <div className="articleTitle">
                                        {ReactHtmlParser(item.summary.slice(0, 200)+' ......')}
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
