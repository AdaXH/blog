import React, { useState } from 'react';
import { Input, message } from 'antd';
import Cookies from 'js-cookie';
import { leaveMessage } from '../../service';
import styles from './index.less';

export default ({ queryMsg, history }) => {
  const [value, setValue] = useState();
  const isLogin = Cookies.get('token');
  const onSubmit = async () => {
    if (!Cookies.get('token')) {
      message.warn('还没有登陆，即将跳转登录');
      history.push('/home/all/qq-login');
      return;
    }
    if (!value || !value.trim()) {
      message.warn('输入不规范');
      return;
    }
    const { success, data } = await leaveMessage({
      date: Date.now(),
      quickReply: !isLogin,
      content: value,
    });
    if (success && data) {
      queryMsg(1);
      setValue();
    }
  };
  return (
    <div className={styles.msgFooter}>
      <Input.TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoSize={{ minRows: 1, maxRows: 1 }}
        maxLength={100}
      />
      <a onClick={onSubmit}>发送</a>
    </div>
  );
};
