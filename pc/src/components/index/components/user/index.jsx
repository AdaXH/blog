import React, { useState } from 'react';
import { handleFile } from './util';
import Modal from './modal';
import styles from './index.less';

export default props => {
  const { user, dispatch } = props;
  const [visible, setVisible] = useState(false);
  const handleUpload = (info, callback) => {
    const file = info.nativeEvent.target.files[0];
    handleFile(file, dispatch, user.name, callback);
  };
  return (
    <div className={styles.loginFinish}>
      <Modal
        visible={visible}
        setVisible={setVisible}
        user={user}
        dispatch={dispatch}
        handleUpload={handleUpload}
      />
      <div
        className={styles.userAvatar}
        style={{ backgroundImage: `url(${user.avatar})` }}
      />
      <div className={styles.welcomeWord}>
        <span>{user.name}</span>
      </div>
      <div className={styles.operation}>
        <div onClick={() => setVisible(true)}>
          <span>修改信息</span>
        </div>
        <div
          onClick={() =>
            dispatch({
              type: 'user/signOut',
            })
          }
          className={styles.signOut}
        >
          <span>注销</span>
        </div>
      </div>
    </div>
  );
};
