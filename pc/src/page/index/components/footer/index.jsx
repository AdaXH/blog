import React from 'react';
import styles from './index.less';

export default () => {
  const curraneYear = new Date().getFullYear();
  return (
    <div className={styles.footerInfo}>
      React Blog © 2018 - {curraneYear} Adaxh
    </div>
  );
};
