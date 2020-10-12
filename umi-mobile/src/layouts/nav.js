import React, { useEffect, useState, useRef } from 'react';
import DocumentTitle from './documentTitle';
import { NAVS } from './constant';
import { debouuce } from './hooks';
import classnames from 'classnames';
import styles from './index.less';

export default ({ history }) => {
  const onClick = (url) => {
    history.push(url);
  };
  const ref = useRef();
  const className = (bool) =>
    classnames({
      [styles.isCurrent]: bool,
    });
  const {
    location: { pathname, search },
  } = history;
  useEffect(() => {
    if (ref.current) {
      document.body.addEventListener(
        'scroll',
        debouuce((e) => {
          const {
            target: { scrollTop },
          } = e;
          const base = document.documentElement.clientWidth / 3.75;
          // console.log('scrollTop / base', scrollTop / base);
          setBg(scrollTop / base > 2.3);
        }),
      );
    }
  }, [ref]);
  const [bg, setBg] = useState(false);
  const { text } = NAVS.find((item) => item.url === pathname) || {};
  return (
    <header
      ref={ref}
      className={classnames({
        [styles.bg]: bg,
      })}
    >
      <DocumentTitle title={`Ada - ${text || ''}`} />
      {NAVS.map(({ title, url }) => (
        <div className={className(url === pathname + search)} onClick={() => onClick(url)}>
          <a>{title}</a>
        </div>
      ))}
    </header>
  );
};
