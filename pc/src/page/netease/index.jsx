import React, { useRef, useState, useEffect } from 'react';
import { useDidMount } from '@/utils/hooks';
import { delay } from '@/utils/functions';
import { startMin, initObj } from './lib';
import FlyItem from './component/flyItem';
import { getComment, getConfig } from './service';
import { MAX_COUNT } from './constant';
import { randomKeyword } from './util';
import styles from './index.less';

export default () => {
  const ref = useRef({});
  useEffect(
    () => {
      if (ref.current) {
        startMin();
        initObj(ref.current);
      }
    },
    [ref]
  );
  const [list, setState] = useState([]);
  const [keywords, setKeywords] = useState([]);
  async function queryMoment() {
    if (!keywords.length) return;
    const { comment } =
      (await getComment({
        keyword: randomKeyword(keywords),
      })) || {};
    if (comment) {
      list.push(comment);
      setState([...list]);
    }
  }
  useDidMount(async () => {
    const { config } = (await getConfig()) || {};
    if (config) {
      try {
        setKeywords(config.neteaseKeyword.split(','));
      } catch (error) {
        // ingore
      }
    }
  });
  async function init() {
    let idx = 0;
    // eslint-disable-next-line no-unused-vars
    for await (const item of MAX_COUNT) {
      await delay(idx);
      await queryMoment();
      idx++;
    }
  }
  useEffect(
    () => {
      init();
    },
    [keywords]
  );
  return (
    <div className={styles.neteaseContainer}>
      <div
        ref={ref}
        id="snow-container"
        className={styles.snowContainer}
        count={5000}
      >
        {list.map((item, index) => (
          <FlyItem
            length={list.length}
            index={index}
            key={item.commentId}
            data={item}
            keywords={keywords}
          />
        ))}
      </div>
    </div>
  );
};
