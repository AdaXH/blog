import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Loading } from '@/util/module';
import { addFriend } from './service';
import Tip from './tip';
import styles from './index.less';

export default Form.create()((props) => {
  console.log('message', message);
  const {
    visible,
    setVisible: close,
    form: { getFieldDecorator, validateFields },
  } = props;
  const onOk = async () => {
    try {
      Loading.show();
      const value = await validateFields();
      const res = await addFriend(value);
      console.log('res', res);
      const { success, errorMsg } = res || {};
      if (success) {
        message.success('您已提交申请，请耐心等待邮件回复。');
        close();
      } else {
        message.error(errorMsg || '提交失败');
      }
    } catch (error) {
    } finally {
      Loading.hide();
    }
  };
  return (
    <Modal
      destroyOnClose
      className={styles.add}
      onCancel={close}
      visible={visible}
      okText="提交申请"
      cancelText="取消"
      okButtonProps={{ type: 'default' }}
      cancelButtonProps={{ type: 'danger' }}
      onOk={onOk}
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
              required: true,
              message: '邮箱格式不太对!',
            },
          ],
        })(<Input placeholder="申请通过会邮箱通知~" />)}
      </Form.Item>
      <Tip />
    </Modal>
  );
});
