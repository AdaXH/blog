import React from 'react';
import showdown from 'showdown';
import { replaceEmoji } from './util';

import styles from './index.less';

const converter = new showdown.Converter();

export default ({ value, emojiList }) => {
  console.log('emojiList', emojiList);
  return (
    <div
      className={styles.preview}
      data="preview："
      dangerouslySetInnerHTML={{
        __html: converter.makeHtml(replaceEmoji(value, emojiList) || ''),
      }}
    />
  );
};
