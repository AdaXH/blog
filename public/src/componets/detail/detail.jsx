import React from 'react'
import { Toast } from 'antd-mobile'
import ReactHtmlParser from 'react-html-parser'
import { Icon } from 'antd'
import './detail.css'
export class ArticleDetail extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        Toast.loading('加载中...', this.state.time, () => {
        });
        const _id = this.props.match.params.id
        fetch('/queryArticleById', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify({ _id })
        }).then(res => {
            if (res.status >= 200 && res.status < 300) return res.json()
            return res.status
        }).then(result => {
            if (result.success) {
                this.setState({
                    data: result.data
                },() => Toast.hide())
            } else {
                Toast.loading(result.errorMsg || '网络繁忙' + result, 3);
            }
        })
    }
    render() {
        return (
            <div className="detailContainer">
                <div className="articleStatus1">
                    <div className="articleStatus1">
                        <div>
                            <Icon style={{position:'relative',top:'1px'}} type="clock-circle" /><span style={{ marginLeft: '4px' }}>{this.state.data.year}-{this.state.data.date}</span>
                        </div>
                        <div>
                            <Icon style={{position:'relative',top:'2px'}} type='tag' /><span style={{ marginLeft: '4px' }}>{this.state.data.type}</span>
                        </div>
                        <div>
                            <Icon style={{position:'relative',top:'1px'}} type='like' /><span style={{ marginLeft: '4px'}}>{this.state.data.viewer}</span>
                        </div>
                    </div>
                </div>
                {ReactHtmlParser(this.state.data.summary)}
            </div>
        )
    }
}