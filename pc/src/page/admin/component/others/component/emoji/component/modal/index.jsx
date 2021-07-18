import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { updateEmoji } from '../../service';

import styles from './index.less';

export default ({ onClose, code: oldCode, _id, src, onUpdate }) => {
  const [emojiInfo, setInfo] = useState({
    code: oldCode || '',
    dataUrl: '',
  });
  const { code, dataUrl } = emojiInfo;
  const onSetCode = (e) => {
    setInfo({
      ...emojiInfo,
      code: e.target.value,
    });
  };
  const onSelectFile = (info) => {
    const file = new FileReader();
    const curFile = info.nativeEvent.target.files[0];
    file.readAsDataURL(curFile);
    file.onload = (arg) => {
      if (arg.target.result) {
        const fileType = curFile.name.split('.');
        setInfo({
          ...emojiInfo,
          dataUrl: arg.target.result,
          fileType: fileType[fileType.length - 1],
        });
      }
    };
  };
  const onOk = async () => {
    const { src: newSrc } = await updateEmoji({ ...emojiInfo, _id });
    onUpdate(newSrc, code, _id);
    onClose();
  };
  return (
    <Modal visible onOk={onOk} onCancel={onClose}>
      <div className={styles.item}>
        <span>code：</span>
        <span>
          <Input value={code} onChange={onSetCode} />
        </span>
      </div>
      <div className={styles.item}>
        <span>emoji：</span>
        <span>
          <input onChange={onSelectFile} type="file" />
        </span>
      </div>
      <div className={styles.item}>
        <span>preview：</span>
        <span>
          <img src={dataUrl || src} alt="" />
        </span>
      </div>
    </Modal>
  );
};
