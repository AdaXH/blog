import React from 'react';
import { FLY_USERS, MAX_PAGE_COUNT } from '../constant';
import styles from '../index.less';
export default ({ data }) => {
  console.log('data', data);

  if (!data.length) return null;
  const renderList = data.filter(item => FLY_USERS.includes(item.name));
  if (!renderList.length) return null;
  return (
    <div className={styles.flyMsgContainer}>
      {renderList.slice(0, MAX_PAGE_COUNT).map((item, i) => {
        return (
          <div
            key={item._id}
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
