import React from 'react';
import { TABS } from './constant';
import styles from './index.less';

export default () => {
  return (
    <div>
      {TABS.map(({ title, Component }) => (
        <div className={styles.item} key={title}>
          <h3>{title}</h3>
          <div className={styles.container}>{<Component />}</div>
        </div>
      ))}
    </div>
  );
};
