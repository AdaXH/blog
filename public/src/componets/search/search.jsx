import React from 'react'
import './search.css'
import { Toast, Popover } from 'antd-mobile'
import { API } from '../../request/request'
import ReactHtmlParser from 'react-html-parser';
const Item = Popover.Item
export class Search extends React.PureComponent{
    constructor(props){
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        const { wd } = this.props.match.params
        if (!!wd){
            Toast.loading('加载中', 10)
            API('/search1', 'POST', { data: wd }).then(res => {
                Toast.hide()
                res.success && res.result.length === 0 && Toast.offline('并没有找到关于"' + wd + '"的相关呢', 2, () => this.props.history.push('/index'))
                res.success ? this.setState({ data: res.result }) : Toast(res)
            })
        }
    }
    onSelect(key) {
        const _id = key.props.value
        if (key.key === '4') {
            this.props.history.push('/article/' + _id)
        }
    }
    render(){
        console.log(this.state.data)
        return(
            <div className="searchContainer contentSlideFromLeft">
                <ul className="searchList">
                    {
                        this.state.data.map(item => {
                            return(
                                <li className="searchItem itemFromLeft" key={item._id}>
                                    <div className="searchHeader">
                                        <div className="searchDate" style={{ [item.type === '文章' && 'width']: '50%', [item.type === '文章' && 'flex']: 'none', textAlign: 'left'}}>
                                            <span>时间：</span>
                                            <span>{item.date}</span> 
                                        </div>
                                        <div className="searchType">
                                            <span>类别：</span>
                                            <span>{item.type}</span>
                                        </div>
                                        {
                                            item.type === '文章' &&
                                            <div className='searchOperation' style={{textAlign:'right'}}>
                                                <Popover mask
                                                    overlayClassName="fortest"
                                                    overlayStyle={{ color: 'currentColor' }}
                                                    visible={this.state.visible}
                                                    overlay={[
                                                        (<Item key="4" value={item._id} data-seed="logId">查看详情</Item>),
                                                    ]}
                                                    align={{
                                                        overflow: { adjustY: 0, adjustX: 0 },
                                                        offset: [-10, 0],
                                                    }}
                                                    onSelect={(key) => this.onSelect(key)}
                                                >
                                                    <div>more</div>
                                                </Popover>
                                            </div>
                                        }
                                    </div>
                                    <div className="searchSummary">
                                        {item.type === '文章' ? ReactHtmlParser(item.summary.slice(0, 200).replace(/contenteditable="true"/g, '') + ' ......') : <div>{item.summary}</div>}
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