import React from 'react'
import { TextareaItem, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { connect } from 'react-redux'
import { Button } from 'antd-mobile'
import './dialog.css'
const newDynamic = {
    title: '',
    content: '',
}
const UI = props => {
    const data = {
        title: (props.dialog.dynamic && props.dialog.dynamic.title) || '',
        content: (props.dialog.dynamic && props.dialog.dynamic.content) || ''
    }
    function setDate(key, value) {
        props.dialog.dialogType === 'newDynamic' ? (newDynamic[key] = value) : (data[key] = value)
    }
    function submit(dynamic) {
        newDynamic.hide = props.hide
        data.hide = props.hide
        window.debug() && console.log(data)
        props.dialog.cb && props.dialog.cb(props.dialog.dialogType === 'newDynamic' ? (props.dialog.dialogType === 'leaveMessage' ? data : newDynamic) : data)
    }
    function resetView(){
        document.getElementsByClassName('view')[0].scrollIntoView(false)
    }
    return (
        <div className="editBg">
            <div className="editDialog dialogAnimation">
                {(props.dialog.dialogType === 'newDynamic' || props.dialog.dialogType === 'editDynamic') &&
                    <InputItem onBlur={() => resetView()} placeholder='在这里输入标题' onKeyUp={(e) => setDate('title', e.nativeEvent.target.value)} defaultValue={(props.dialog.dynamic && props.dialog.dynamic.title) || ''}
                        {...props.form.getFieldProps('autofocus')}
                        clear
                    ><span className='inputTitle'>标题：</span></InputItem>
                }
                <TextareaItem
                    // autoFocus={props.dialog.dialogType === 'leaveMessage'}
                    placeholder={props.dialog.placeholder || ''}
                    onBlur={() => resetView()}
                    onKeyUp={(e) => setDate('content', e.nativeEvent.target.value)}
                    {...props.form.getFieldProps('count', {
                        initialValue: (props.dialog.dynamic && props.dialog.dynamic.content) || '',
                    })}
                    rows={5}
                    count={props.dialog.count || 100}
                />
                <div className="dialogFooter">
                    <Button onClick={() => {
                        props.hide({ visible: false })
                        props.dialog.cancelCallback && props.dialog.cancelCallback()
                        newDynamic.title = ''
                        newDynamic.content = ''
                    }} type='default'>取消</Button>
                    <Button type='default' onClick={() => submit(props.dynamic)} >确定</Button>
                </div>
            </div>
        </div>
    )

}
export const Dialog = connect(state => {
    return {
        dialog: state.dialog
    }
}, dispatch => {
    return {
        hide(payload) {
            dispatch({ type: 'QUERY_DYNAMIC', payload })
        },
        _setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        }
    }
})(createForm()(UI))