import React, { useEffect, useRef, useState } from 'react';
// import Cookies from 'js-cookie';
import { Route } from 'react-router-dom';
import touch from 'touchjs';
import { Component } from '@/common/util';
import { useDidMount } from '@/util/hooks';
import Footer from '../footer';
import { LOGO, STATIC_TEXT } from './constant';
import { getConfig } from './service';
import { replaceStr } from './util';
import styles from './index.less';

export default () => {
  return (
    <Route
      path="/"
      exact
      children={(arg) => (
        <Component
          {...arg}
          classNames={{
            enter: styles.centerEnter,
            exit: styles.centerExit,
          }}
          item={() => <Center {...arg} />}
        />
      )}
    />
  );
};

function Center(props) {
  const { history } = props;
  const [data, setData] = useState(STATIC_TEXT);
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      touch.on('#refId', 'swipeup', (e) => {
        history.push('/home/all');
      });
    }
  }, [ref]);
  useDidMount(async () => {
    const { config } = await getConfig();
    if (config) {
      const { text1, text2 } = config;
      setData({ text1: replaceStr(text1), text2: replaceStr(text2) });
    }
  });
  const { text1, text2 } = data || {};
  return (
    <div id="refId" ref={ref} className={styles.defaultCenter}>
      <div className={styles.centerBox}>
        <div className={styles.logoInfo}>
          <img alt=" " src={LOGO} />
        </div>
        <div className={styles.staticText}>{text1}</div>
        <div className={styles.staticText2}>{text2}</div>
        <div className={styles.slideTip}>
          <span className={styles.slideText}>slide up</span>
          <i className="iconfont icon-huadong" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
