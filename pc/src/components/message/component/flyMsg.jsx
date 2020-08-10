import React from 'react';
// import { FLY_USERS, MAX_PAGE_COUNT } from '../constant';
import styles from '../index.less';
export default ({ data }) => {
  if (!data.length) return null;
  return (
    <div className={styles.flyMsgContainer}>
      {data.slice(0, 3).map((item, i) => {
        return (
          <div
            key={i}
            style={{ animationDuration: 20 + i + 's' }}
            className={styles.msgFlyItem}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};
