import React from 'react';
import { Modal, Form, Input } from 'antd';
import Loading from '../../../wrapComponent/Loading';
import { addFriend } from '../service';
import Tip from './tip';
import styles from '../index.less';
import Notification from '../../../wrapComponent/Notification';

export default Form.create()((props) => {
  const {
    visible,
    setVisible: close,
    form: { getFieldDecorator, validateFields },
  } = props;
  const onOk = async () => {
    try {
      Loading.show();
      const value = await validateFields();
      const { success, errorMsg } = (await addFriend(value)) || {};
      if (success) {
        Notification.success({
          msg: `您已提交申请，请耐心等待邮件回复。\n如果您着急，可以打开首页的“来聊骚吗”反馈`,
          duration: 8,
        });
        close();
      } else {
        Notification.error({ mag: errorMsg || '提交失败' });
      }
    } catch (error) {
    } finally {
      Loading.hide();
    }
  };
  return (
    <Modal
      destroyOnClose
      className={styles.modal}
      maskClosable={false}
      onCancel={close}
      visible={visible}
      okText="提交申请"
      cancelText="取消"
      okButtonProps={{ type: 'default' }}
      cancelButtonProps={{ type: 'danger' }}
      onOk={onOk}
      zIndex={100}
      maskStyle={{ background: 'transparent' }}
    >
      <Form.Item label="标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input placeholder="您的站点标题" />)}
      </Form.Item>

      <Form.Item label="描述">
        {getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input placeholder="您的站点描述" />)}
      </Form.Item>

      <Form.Item label="站点链接">
        {getFieldDecorator('link', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input placeholder="您的站点链接" />)}
      </Form.Item>

      <Form.Item label="站点图标">
        {getFieldDecorator('icon', {
          rules: [
            {
              required: true,
              message: '请输入图标地址',
            },
          ],
        })(<Input placeholder="图标" />)}
      </Form.Item>

      <Form.Item label="邮箱">
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: '邮箱格式不太对!',
            },
          ],
        })(<Input placeholder="申请通过会邮箱通知~" />)}
      </Form.Item>
      <Tip />
    </Modal>
  );
});
