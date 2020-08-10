import React, { useState } from 'react';
import { Radio, Input } from 'antd';
import styles from '../../index.less';
export default props => {
  const {
    user: { avatar },
    handleUpload,
    setFieldsValue,
    code,
  } = props;
  const [type, changeType] = useState(
    /ada.bucket/.test(avatar) ? 'upload' : 'link'
  );
  const [linkVal, setLink] = useState(avatar);
  const setAvatarLink = link => {
    setLink(link);
    setFieldsValue({ [code]: link });
  };
  const isUpload = type === 'upload';
  return (
    <div>
      <span className={styles.label}>设置头像形式：</span>
      <Radio.Group
        className={styles.radioAvatar}
        value={type}
        onChange={e => changeType(e.target.value)}
      >
        <Radio value="upload">图片上传</Radio>
        <Radio value="link">链接形式</Radio>
      </Radio.Group>
      <div className={styles.avatarCon}>
        <span className={styles.label}>
          {isUpload ? '点击右侧上传：' : '输入图片链接：'}
        </span>
        {isUpload ? (
          <div>
            <div
              className={styles.userAvatar1}
              style={{ backgroundImage: `url(${avatar})` }}
            >
              <input
                type="file"
                title=""
                onChange={info =>
                  handleUpload(info, avatar => setFieldsValue({ avatar }))
                }
              />
            </div>
          </div>
        ) : (
          <Input
            value={linkVal}
            onChange={e => setAvatarLink(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
