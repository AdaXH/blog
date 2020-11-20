import React from 'react';
// import { FLY_USERS, MAX_PAGE_COUNT } from '../constant';
import { getHtml } from '../util';
import styles from '../index.less';
export default ({ data, emojiList }) => {
  if (!data.length) return null;
  return (
    <div className={styles.flyMsgContainer}>
      {data.slice(0, 3).map((item, i) => {
        return (
          <div
            key={i}
            style={{ animationDuration: 20 + i + 's' }}
            className={styles.msgFlyItem}
            dangerouslySetInnerHTML={{
              __html: getHtml(item.content, emojiList),
            }}
          />
        );
      })}
    </div>
  );
};
