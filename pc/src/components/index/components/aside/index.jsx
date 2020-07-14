import React from 'react';
import { operations } from './util';
import styles from './index.less';

const handleOperation = item => {
  typeof item.url === 'string' ? window.open(item.url) : item.url();
};
export default () => (
  <div className={styles.operationContainer}>
    <div className={styles.api}>
      <div className={styles.icon}>
        <i className="iconfont icon-menu" />
      </div>
    </div>
    <ul className="target">
      {operations.map((item, index) => (
        <li
          key={index}
          className="target"
          onClick={() => handleOperation(item)}
        >
          <i className={`iconfont target ${item.icon}`} />
          <span className="target">{item.text}</span>
        </li>
      ))}
    </ul>
  </div>
);
