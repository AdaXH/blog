import React  from 'react';
import './login.css'
import { connect } from 'react-redux';
import { Icon, Row, Col, Button, Form, Checkbox, Input } from 'antd'
import { Toast } from 'antd-mobile'
import { Base64 } from 'js-base64'
const FormItem = Form.Item
const UI = props => {
    const { getFieldDecorator } = props.form;
    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                if (/ /.test(values.name)){
                    Toast.fail('用户名不包含空格', 1)
                    return
                }
                if (values.name.length > 20) {
                    Toast.fail('用户名不超过20字符', 1)
                    return
                }
                if (/ /.test(values.pwd)) {
                    Toast.fail('密码不包含空格', 1)
                    return
                }
                if (values.pwd.length > 20) {
                    Toast.fail('密码不超过16位', 1)
                    return
                }
                values.pwd = Base64.encode(values.pwd)
                console.log('Received values of form: ', values);
                Toast.loading(props.type + '中...', 3)
                fetch(props.type === 'login' ? '/login' : '/register', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    Toast.hide()
                    if (res.status >= 200 && res.status < 300) return res.json()
                    return res.status
                }).then(result => {
                    if (result.success) {
                        Toast.success(props.type === 'login' ? '登陆成功' : '注册成功，已自动登录', 1, () => props.change(props.type, 'hide'))
                        sessionStorage && sessionStorage.setItem('user', Base64.encode(values.name))
                        props.userInfo({ ...result, text: '注销' } )
                    } else {
                        Toast.fail(result.errorMsg, 1)
                    }
                }).catch(err => {
                    Toast.offline(err, 1)
                })
            }
        });
    }
    return(
        <div className={props.status === 'hide' ? 'loginRegContainer' : 'loginRegContainer showContainer'}>
            <div className="backIcon" onClick={ () =>props.change(props.type, 'hide') }>
                <Icon type="left" />
                
            </div>
            <Row type='flex' justify='center'>
                <Col span={10} className='loginLogo'>
                    <div className='loginLogoDiv'>
                        <Icon type="pie-chart" />
                    </div>
                    <div className='loginLogoDiv'>
                        Welcome
                    </div>
                </Col>
            </Row>
            <Row type='flex' justify='center' style={{marginTop:'30px'}}>
                <Col span={23}>
                    <Form onSubmit={(e)=>handleSubmit(e)} className="login-form">
                        <FormItem>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入用户名！' }],
                            })(
                                <Input className='_input' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('pwd', {
                                rules: [{ required: true, message: '请输入密码！' }],
                            })(
                                <Input className='_input' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        
                            {props.type === 'login' && 
                            <FormItem>
                            {getFieldDecorator('state', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                 <Checkbox>记住登录状态</Checkbox>
                            )}
                        </FormItem>
                            }
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                {props.type === 'login' ? '登陆' : '注册'}
                            </Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
const WrappedNormalLoginForm = Form.create()(UI);

export const LoginReg = connect(state => {
    return {
        ...state.loginUI
    }
}, dispatch => {
    return {
        change(type, status){
            dispatch({ type: 'CHANGE', payload: { type, status } })
        },
        userInfo(user) {
            dispatch({ type: 'SET_USER_VO', payload: { ...user } })
        },
    }
    })(WrappedNormalLoginForm)