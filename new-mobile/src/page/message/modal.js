import React, { useState } from 'react';
import { Modal, Input, Checkbox, Button, message } from 'antd';
import Cookies from 'js-cookie';
import { leaveMessage } from './service';
import styles from './index.less';

export default ({ queryMsg }) => {
  const isLogin = Cookies.get('token');
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();
  const [quickReply, changeQuick] = useState(!isLogin);
  const handleSubmit = async () => {
    if (!quickReply && !isLogin) {
      message.warn('还没有登陆，可以勾选快捷评论');
      return;
    }
    if (!value || !value.trim()) {
      message.warn('输入不规范');
      return;
    }
    const { success, data } = await leaveMessage({
      date: Date.now(),
      quickReply,
      content: value,
    });
    if (success && data) {
      queryMsg(1);
      setValue(false);
      setVisible(false);
    }
  };
  const style = {
    transform: `rotate(${visible ? '45deg' : '0deg'})`,
  };
  return (
    <React.Fragment>
      <a className={styles.entry} onClick={() => setVisible(true)}>
        <span style={style}>
          <i className="iconfont icon-add" />
        </span>
      </a>
      <Modal
        className={styles.add}
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <Input.TextArea
          placeholder="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={styles.replayFooter}>
          <Button className={styles.submit} type="danger" onClick={handleSubmit}>
            提交
          </Button>
          <span className={styles.quickMsg}>
            <Checkbox checked={quickReply} onChange={(e) => changeQuick(e.target.checked)}>
              启用快捷评论（无需登录）
            </Checkbox>
          </span>
        </div>
      </Modal>
    </React.Fragment>
  );
};
