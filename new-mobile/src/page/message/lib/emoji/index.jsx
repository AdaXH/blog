// import a from './images/daku.png';
import React, { memo } from 'react';
import { EMOJI_MAP } from './constant';
import styles from './index.less';

export default memo(({ onAdd }) => {
  return (
    <div className={styles.emojiContaienr}>
      {EMOJI_MAP.map((item) => (
        <a key={item.code} className={styles.emojiItem} onClick={() => onAdd(item.code)}>
          <img src={item.src} />
        </a>
      ))}
    </div>
  );
});
