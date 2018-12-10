import React from 'react'
import { Toast } from 'antd-mobile'
import ReactHtmlParser from 'react-html-parser'
import { Icon } from 'antd'
import './detail.css'
import { API } from '../../request/request';
export class ArticleDetail extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        Toast.loading('加载中...', 30, () => {
        });
        const _id = this.props.match.params.id
        API('/queryArticleById', 'POST', { _id }).then(result => result.success ? this.setState({ data: result.data }, Toast.hide()) : Toast.offline('无法读取文章内容'))
    }
    render() {
        return (
            <div className="detailContainer contentSlideFromLeft">
                <div className="articleStatus1 itemFromLeft">
                    <div className="articleStatus1">
                        <div>
                            <Icon style={{ position: 'relative', top: '1px' }} type="clock-circle" /><span style={{ marginLeft: '4px' }}>{this.state.data.year}-{this.state.data.date}</span>
                        </div>
                        <div>
                            <Icon style={{ position: 'relative', top: '2px' }} type='tag' /><span style={{ marginLeft: '4px' }}>{this.state.data.type}</span>
                        </div>
                        <div>
                            <Icon style={{ position: 'relative', top: '1px' }} type='like' /><span style={{ marginLeft: '4px' }}>{this.state.data.viewer}</span>
                        </div>
                    </div>
                </div>
                {ReactHtmlParser(this.state.data.summary && this.state.data.summary.replace(/contenteditable="true"/g, ''))}
            </div>
        )
    }
}