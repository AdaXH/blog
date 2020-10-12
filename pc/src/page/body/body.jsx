import React, { useRef } from 'react';
import { connect } from 'dva';
import { useDidMount } from '@/utils/hooks';
import { loadImg } from './util';
import styles from './index.less';
const Body = ({ config }) => {
  const bgRef = useRef({});
  const colorRef = useRef({});
  const bgList = config.bgImg;
  useDidMount(async () => {
    if (bgRef.current && colorRef.current && bgList) {
      let idx = 0;
      await randomBg(idx);
      Body.interval = setInterval(async () => {
        idx += 1;
        if (idx === bgList.length - 1) {
          idx = 0;
        }
        await randomBg(idx);
      }, 20000);
    }
  });
  async function randomBg(idx) {
    const { img, color } = await loadImg(bgList[idx]);
    if (!img) return;
    bgRef.current.style.background = `url(${img}) no-repeat center 0`;
    colorRef.current.style.background = color;
  }
  return (
    <span>
      <div ref={bgRef} className={styles.bg} />
      <div ref={colorRef} className={styles.bgOverlay} />
    </span>
  );
};
export default connect(({ blogConfig: { config } }) => ({ config }))(Body);
