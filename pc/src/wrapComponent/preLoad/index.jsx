import React from 'react';
import styles from './index.less';

export default ({ className }) => {
  return (
    <div className={`${styles.preLoad} ${className}`}>
      <div className={styles.con}>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
      </div>
      <div className={styles.text}>
        LOADING
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};
