import React from 'react';
import { STATIC_TEXT } from './constant';
import styles from './index.less';

export default ({ onAdd }) => {
  return (
    <div className={styles.box}>
      {STATIC_TEXT.map((item, index) => (
        <div onClick={() => onAdd(item, 1)} className={styles.item} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};
