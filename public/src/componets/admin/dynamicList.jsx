import React from 'react'
import { connect } from 'react-redux'
import { SwipeAction, List, Toast } from 'antd-mobile'
import { API } from '../../request/request'
import { Icon } from 'antd'
class UI extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dynamics: [],
            data: {}
        }
    }
    componentDidMount(){
        const { dynamics } = this.props
        if (dynamics.length !== 0)
            this.setState({ dynamics })
    }
    handleSwiper(type, _id) {
        if (type === 'edit'){
            const { dynamics } = this.props
            const currentDynamic = dynamics.filter(item => item._id === _id)
            const { title, content }  = currentDynamic[0]
            const cb = data => {   
                data._id = _id 
                window.debug() && console.log(data)
                if (data.title === title && data.content === content) {
                    Toast.offline('内容未更改', 1)
                    return
                }
                Toast.loading('更新中', 10)
                API('/updateDynamic', 'POST', data).then(result => {
                    if (result) {
                        Toast.hide()
                        Toast.success('更新成功', 1)
                        data.hide({ visible: false })
                        this.props.updateData({ payload: { type: 'dynamics', data } })
                    }
                })
            }
            this.props.queryDynamic({ _id , visible: true, cb })
            return
        }
        Toast.loading('删除中', 10)
        API('/deleteDynamic', 'POST', { _id }).then(result => {
            if (result.success){
                Toast.hide()
                const { dynamics } = this.state
                const data = dynamics.filter(item => item._id !== _id)
                Toast.success('已删除', 1.5)
                this.setState({
                    dynamics: data
                }, () => this.props.setData({ payload: { type: 'dynamics', data: [...data] } }))
            }
        })
    }
    callback(updateVO){ //发布dynamic的回调
        if (!updateVO.title || !updateVO.title.trim() === '') {
            Toast.offline('标题呢？', 1)
            return
        }
        if (!updateVO.content || updateVO.content.trim() === '') {
            Toast.offline('内容呢？', 1)
            return
        }
        const date = new Date();
        const d = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
        API('/addDynamic', 'POST', { ...updateVO, date: d, upvote: 1 }).then(result => {
            if (result.success) {
                Toast.success('发布成功', 1.5)
                this.props.setData({ payload: { type: 'dynamics', data: result.data.reverse() } })
                updateVO.hide({ visible: false })
            } else Toast.offline(result)
        })
    }
    render() {
        return (
            <div className="dynamicListContainer contentSlideFromLeft">
                <div className="newDynamic" onClick={() => {
                    this.props.newDynamic({ cb: (data) => this.callback(data), placeholder: '在这里输入内容'})
                }} >
                    <Icon type='plus'/>
                </div>
                <List>
                    {
                        this.state.dynamics.map(item => {
                            return (
                                <SwipeAction key={item._id} style={{ backgroundColor: 'gray' }}
                                    autoClose
                                    right={[
                                        {
                                            text: '编辑',
                                            onPress: () => this.handleSwiper('edit', item._id, item),
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
                                            <div>{item.title}</div>
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
export const DynamicList = connect(state => {
    return {
        dynamics: state.datas.dynamics
    }
}, dispatch => {
    return {
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        },
        queryDynamic(payload){
            dispatch({ type: 'QUERY_DYNAMIC', payload })
        },
        updateData(params) {
            dispatch({ type: 'UPDATE_DATA', ...params })
        },
        newDynamic(payload){
            dispatch({ type: 'NEW_DYNAMIC', payload })
        }
    }
})(UI)