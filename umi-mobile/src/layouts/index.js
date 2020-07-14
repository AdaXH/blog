import { Fragment, useState, useEffect } from 'react';
import { Icon } from 'antd';
import { mapChildren } from './util';
import styles from './index.less';
function BasicLayout({ children, history }) {
  const {
    location: { pathname },
    push,
  } = history;
  const show = pathname !== '' && pathname !== '/';
  const d = new Date();
  const h = d.getHours();
  const [theme, toggle] = useState(h < 19);
  useEffect(() => {
    const target = document.querySelector('#root');
    const style = `background: ${theme ? 'white' : '#525252'}`;
    target.style.cssText = style;
  }, [theme]);
  const copyChildren = mapChildren(children, theme ? 'light' : 'dark');
  return (
    <Fragment>
      {copyChildren}
      {show && (
        <div className={styles.back} onClick={() => push('/')}>
          <Icon type="rollback" />
        </div>
      )}
      <div className={styles.theme} onClick={() => toggle(!theme)}>
        <svg className="icon" aria-hidden="true">
          <use href={`#icon-${theme ? 'moon' : 'moon1'}`}></use>
        </svg>
      </div>
    </Fragment>
  );
}

export default BasicLayout;
