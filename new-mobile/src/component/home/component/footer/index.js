import React, { memo } from 'react';
import styles from './index.less';

export default memo(() => {
  const curraneYear = new Date().getFullYear();
  return (
    <div className={styles.footerInfo}>
      React Blog, made with <span>❤</span> by{' '}
      <a
        href="https://www.baidu.com/s?wd=Ada%20blog%20Home&oq=Ada%2520blog%2520Home"
        target="blank"
      >
        Ada
      </a>{' '}
      © 2018 - {curraneYear}
    </div>
  );
});
