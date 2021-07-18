import React, { memo } from 'react';
import styles from './index.less';

export default memo(() => {
  const curraneYear = new Date().getFullYear();
  return (
    <div className={styles.footerInfo}>
      React Blog, made with <span>❤</span> by{' '}
      <a href="https://www.baidu.com/s?wd=Ada%20卑微小前端" target="blank">
        Ada
      </a>{' '}
      © 2018 - {curraneYear}
      <div className={styles.ba}>
        <a
          target="blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602010125"
        >
          <img src="/ba.png" alt="" />
          <p>浙公网安备33010602010125号 滇ICP备2020009525号</p>
        </a>
      </div>
    </div>
  );
});
