// import a from './images/daku.png';
import React, { memo } from 'react';
import styles from './index.less';

export default memo(({ onAdd, emojiList }) => {
  return (
    <div className={styles.emojiContaienr}>
      {emojiList.map((item) => (
        <a
          key={item.code}
          className={styles.emojiItem}
          onClick={() => onAdd(item.code)}
        >
          <img src={item.src} />
        </a>
      ))}
    </div>
  );
});
