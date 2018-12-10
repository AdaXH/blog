import React from 'react'
import { Popover, PullToRefresh, Toast } from 'antd-mobile'
import { Icon } from 'antd'
import './article.css'
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux'
import { API } from '../../request/request'
import ReactDOM from 'react-dom'

const Item = Popover.Item
class UI extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            visible: false,
            height: document.documentElement.clientHeight,
            refreshing: false
        }
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei
        }), 0);
        const { articles } = this.props
        if (articles.length === 0)
            this.props.history.push('/index')
        this.setState({ data: articles })
    }
    shouldComponentUpdate(arg1, arg2) {
        if (arg2.data.length === 0) return false
        return true
    }
    refresh() {
        this.setState({ refreshing: true })
        API('/getArticles').then(result => {
            if (result.success) {
                this.setState({ data: result.data }, () => this.setState({ refreshing: false }))
                this.props.setData({ payload: { type: 'articles', data: result.data } })
            }
            else Toast.offline('刷新失败', 1)
        })
    }
    onSelect(key, viewer) {
        const _id = key.props.value
        if (key.key === '4') {
            API('/updateArticleViewerById', 'POST', { _id, viewer }).then(result => {
                if (result.success) {
                    const { data } = this.state
                    for (let item of data) {
                        if (item._id === _id) {
                            item.viewer = (viewer + 1)
                            break
                        }
                    }
                    this.props.setData({ payload: { type: 'articles', data } })
                }
            })
            // }
            this.props.history.push('/article/' + _id)
        }
    }
    render() {
        return (
            <div className='articleContainer contentSlideFromLeft'>
                <PullToRefresh refreshing={this.state.refreshing} damping={50} ref={el => this.ptr = el} style={{ height: this.state.height, overflow: 'auto' }} onRefresh={() => this.refresh()}>
                    <div>
                        <ul className="articleList itemFromLeft">
                            {
                                this.state.data.length !== 0 && this.state.data.map(item => {
                                    return (
                                        <li key={item._id} className="articleItem">
                                            <div className="articleStatus">
                                                <div>
                                                    <Icon style={{ position: 'relative', right: '2px', top: '-1px' }} type="clock-circle" /><span style={{ fontSize: '12px' }}>{item.date}</span>
                                                </div>

                                                <div>
                                                    <Icon style={{ position: 'relative', top: '-1px' }} type='fire' /><span style={{ marginLeft: '4px' }}>{item.viewer}</span>
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
                                                            (<Item key="6" value={item._id} ><span style={{ marginRight: 5 }}>分享</span></Item>)
                                                        ]}
                                                        align={{
                                                            overflow: { adjustY: 0, adjustX: 0 },
                                                            offset: [-10, 0],
                                                        }}
                                                        onSelect={(key) => this.onSelect(key, item.viewer)}
                                                    >
                                                        <div>more</div>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="articleTitle">
                                                {ReactHtmlParser(item.summary.slice(0, 200).replace(/contenteditable="true"/g, '') + ' ......')}
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </PullToRefresh>
            </div>
        )
    }
}
export const Article = connect(state => {
    return {
        articles: state.datas.articles
    }
}, dispatch => {
    return {
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        }
    }
})(UI)