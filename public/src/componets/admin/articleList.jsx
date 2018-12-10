import React from 'react'
import { List, SwipeAction, Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser';
import { API } from '../../request/request';

class UI extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            articles: []
        }
    }
    componentDidMount() {
        if (this.props.articles.lemgth !== 0)
            this.setState({
                articles: this.props.articles
            })
    }
    handleSwiper(type, _id) {
        if (type === 'edit') {
            return
        }
        API('/deleteArticle', 'POST', { _id }).then(result => {
            if (result.success) {
                const { articles } = this.state
                const data = articles.filter(item => item._id !== _id)
                Toast.success('已删除', 1.5)
                this.setState({
                    articles: data
                }, () => this.props.setData({ payload: { type: 'articles', data: [...data] } }))
            }
        })
    }
    render() {
        return (
            <div className="articleList contentSlideFromRight">
                <List>
                    {
                        this.state.articles.map(item => {
                            return (
                                <SwipeAction key={item._id} style={{ backgroundColor: 'gray' }}
                                    autoClose
                                    right={[
                                        {
                                            text: '编辑',
                                            onPress: () => this.handleSwiper('edit', item._id),
                                            style: { backgroundColor: '#ddd', color: 'white' },
                                        },
                                        {
                                            text: '删除',
                                            onPress: () => this.handleSwiper('delete', item._id),
                                            style: { backgroundColor: '#F4333C', color: 'white' },
                                        },
                                    ]}
                                >
                                    <List.Item
                                        extra=''
                                        arrow="horizontal"
                                    >
                                        <div className='titleSet'>
                                            <div>{ReactHtmlParser(item.summary.slice(0, 150).replace(/<\/?br>+|contenteditable="true"/g, ''))}</div>
                                            <div>{item.date}</div>
                                        </div>
                                    </List.Item>
                                </SwipeAction>
                            )
                        })
                    }
                </List>
            </div>
        )
    }
}
export const ArticleList = connect(state => {
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