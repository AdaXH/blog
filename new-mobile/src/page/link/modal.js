import React, { useState } from 'react';
import Modal from './modalContent';
import styles from './index.less';

export default ({ queryMsg }) => {
  const [visible, setVisible] = useState(false);
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
      <Modal visible={visible} setVisible={() => setVisible(false)} />
    </React.Fragment>
  );
};
