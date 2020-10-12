import React, { useState } from 'react';
import { replyArticleMsg } from './service';
import { Modal, Input } from 'antd';
import styles from './index.less';

export default (props) => {
  const { visible, onCancel, msgInfo, setData } = props;
  const [msg, setMsg] = useState('');
  const onOk = async () => {
    if (msg.trim() === '') return;
    const res = await replyArticleMsg({ ...msgInfo, msg });
    if (res.success) {
      setMsg('');
      const { message } = res.data;
      setData(
        message.map((item) => {
          const { repeat } = item;
          if (repeat) {
            item.repeat = repeat;
          }
          return item;
        })
      );
      onCancel();
    }
  };
  return (
    <Modal
      className={styles.modal}
      closable={false}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Input.TextArea
        placeholder={`回复${msgInfo.name}`}
        autoSize={{ maxRows: 4, minRows: 4 }}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
    </Modal>
  );
};
