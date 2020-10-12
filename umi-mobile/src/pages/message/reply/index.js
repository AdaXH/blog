import { useState } from 'react';
import { Input, Checkbox, Button, message } from 'antd';
import { leaveMessage } from './service';
import styles from './index.less';
export default ({ user, save }) => {
  const [quickReply, changeQuick] = useState(false);
  const [value, setValue] = useState();
  const handleSubmit = async () => {
    console.log('value', value);
    console.log('quickReply', quickReply);
    if (!quickReply && !user.isLogin) {
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
    //     console.log('res', res);
    if (success && data) {
      save();
    }
  };
  return (
    <div className={styles.reply}>
      <Input.TextArea value={value} onChange={(e) => setValue(e.target.value)} />
      <div className={styles.replayFooter}>
        <Button className={styles.submit} type="danger" onClick={handleSubmit}>
          提交
        </Button>
        <span className={styles.quickMsg}>
          <Checkbox value={quickReply} onChange={(e) => changeQuick(e.target.checked)}>
            启用快捷评论（无需登录）
          </Checkbox>
        </span>
      </div>
    </div>
  );
};
