import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Base64 } from 'js-base64';
import { updateUserInfo } from './service';
import Loading from '../../../../wrapComponent/Loading';
import Notification from '../../../../wrapComponent/Notification';
import EmptyForm from './emptyForm';
import { validatorPwd } from './util';
import Avatar from './component/avatar';
import styles from './index.less';

export default Form.create()((props) => {
  const {
    visible,
    setVisible: close,
    form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
    user,
    handleUpload,
    dispatch,
  } = props;
  if (!visible) return null;
  const { name, email } = user;
  const onOk = async () => {
    try {
      Loading.show();
      const value = await validateFields();
      if (value.password) {
        value.password = Base64.encode(value.password);
        delete value.checkPwd;
      }
      Object.keys(value).forEach((key) => {
        if (!value[key]) delete value[key];
      });
      const { success, errorMsg } = await updateUserInfo({
        _id: user._id,
        ...value,
      });
      if (success) {
        let msg = '已更改';
        if (value.password) {
          msg = '已更改，请重新登录！';
          dispatch({ type: 'user/signOut' });
        } else {
          dispatch({ type: 'user/getUserInfo', payload: {} });
        }
        close();
        Notification.success({ msg });
      } else {
        Notification.error({ mag: errorMsg || '更改失败' });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  };
  const checkRequired = () => {
    const a = getFieldValue('password');
    return !!a;
  };
  const { avatarSrc } = user;
  return (
    <Modal
      destroyOnClose
      className={styles.modal}
      maskClosable={false}
      onCancel={() => close(false)}
      visible={visible}
      okText="确认修改"
      cancelText="取消"
      okButtonProps={{ type: 'default' }}
      cancelButtonProps={{ type: 'danger' }}
      onOk={onOk}
      zIndex={100}
      maskStyle={{ background: 'transparent' }}
    >
      <EmptyForm
        getFieldDecorator={getFieldDecorator}
        code="avatar"
        initValue={avatarSrc || user.avatar}
      />
      <Form.Item label="用户名">
        {getFieldDecorator('name', {
          initialValue: name,
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="邮箱">
        {getFieldDecorator('email', {
          initialValue: email,
          rules: [
            {
              type: 'email',
              required: true,
              message: '邮箱格式不太对!',
            },
          ],
        })(<Input placeholder="邮箱将作为本站交互的通知" />)}
      </Form.Item>
      <Form.Item label="新密码">
        {getFieldDecorator('password', {})(<Input />)}
      </Form.Item>
      <Form.Item label="确认新密码">
        {getFieldDecorator('checkPwd', {
          rules: [
            {
              required: checkRequired(),
              validator: (rule, value, callback) =>
                validatorPwd(rule, value, callback, getFieldValue('password')),
            },
          ],
        })(<Input disabled={!checkRequired()} />)}
      </Form.Item>
      <Avatar
        user={user}
        handleUpload={handleUpload}
        setFieldsValue={setFieldsValue}
        code="avatar"
      />
    </Modal>
  );
});
