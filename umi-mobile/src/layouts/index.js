import { Fragment, useRef } from 'react';
import { connect } from 'dva';
import { mapChildren } from './util';
import Header from './nav';
import Info from '@/pages/component/home/info';
import { NAVS } from './constant';
import Menu from './menu/index';
import IMG from './a.jpg';
import styles from './index.less';
function BasicLayout({ children, history, dispatch, user }) {
  const copyChildren = mapChildren(children, { dispatch, user });
  const ref = useRef();
  history.listen(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  });
  const {
    location: { pathname },
  } = history;
  const { text, title } = NAVS.find((item) => item.url === pathname) || {};
  return (
    <Fragment>
      <Header history={history} />
      <div className={styles.content} ref={ref}>
        <div className={styles.wrapper} style={{ backgroundImage: `url(${IMG})` }}>
          <div className={styles.navInfo} key={pathname}>
            <div className={styles.text}>{text}</div>
            <div className={styles.line} />
            <div className={styles.pathName}>{title}</div>
          </div>
        </div>
        {copyChildren}
        <Menu user={user} dispatch={dispatch} />
      </div>
    </Fragment>
  );
}

export default connect(({ user }) => ({ user }))(BasicLayout);
