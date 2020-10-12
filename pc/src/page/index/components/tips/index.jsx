import React from 'react';
import styles from './index.less';

export default ({ config }) => {
  if (!config) return null;
  const { welcome, text2, text1, customer } = config;
  return (
    <div className={styles.leftContainer}>
      <p className={`${styles.welcome} ${styles.fromLeft}`}>
        {welcome} - <span>No.{customer}</span>
      </p>
      <h2 className={`${styles.extrc} ${styles.fromTop}`}>{text1}</h2>
      <h2 className={`${styles.extrc2} fromBottom`}>{text2}</h2>
    </div>
  );
};
