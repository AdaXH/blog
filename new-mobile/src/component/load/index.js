import React from 'react';
import styles from './index.less';

export default () => {
  return (
    <div>
      <div className={styles.loadingUI}>
        <div className={styles.loadingContainer}>
          <div className={styles['k-ball7a']}></div>
          <div className={styles['k-ball7b']}></div>
          <div className={styles['k-ball7c']}></div>
          <div className={styles['k-ball7d']}></div>
        </div>
      </div>
    </div>
  );
};
