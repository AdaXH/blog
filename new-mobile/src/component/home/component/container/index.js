import React, { Fragment } from 'react';
import Texty from 'rc-texty';
import { Route } from 'react-router-dom';
import { Component } from '@/common/util';
// import classnames from 'classnames';
import ItemRoute from './itemRoute';
import { NAVS } from './constant';
import { getRoutes, getEnter } from './util';
import styles from './index.less';
import { useDidMount } from '@/util/hooks';
import 'rc-texty/assets/index.css';

const routes = getRoutes();
const allroutes = [...routes, ...NAVS.map((item) => ({ path: item.path, text: item.text }))];
export default (props) => {
  const {
    history: { push },
    location: { pathname },
    history,
  } = props;
  useDidMount(() => {
    history.listen(({ pathname: pathName }) => {
      const { text = 'Home' } = allroutes.find((item) => pathName.includes(item.path)) || {};
      document.title = `Ada - ${text}`;
    });
  });
  return (
    <div className={styles.wraper}>
      <div className={styles.top}>
        <div className={styles.nav}>
          {NAVS.map(({ icon, text, path }) => (
            <a
              key={path}
              className={pathname === path && styles.current}
              onClick={() => push(path)}
            >
              <i className={`iconfont ${icon}`} />
              <span>{text}</span>
            </a>
          ))}
          <a className={styles.close} onClick={() => push('/')}>
            <i className="icon-close iconfont" />
          </a>
        </div>
      </div>
      <Fragment>
        {NAVS.map(({ path, hidden, ...others }) => (
          <Route
            path={path}
            children={(arg) => (
              <Component
                {...arg}
                classNames={{
                  enter: styles.secEnter,
                  exit: styles.secExit,
                }}
                item={(arg) => (
                  <ItemRoute {...arg} path={path} {...others} history={props.history} />
                )}
              />
            )}
            key={path}
            exact
          />
        ))}
      </Fragment>
      <div className={styles.slideBottom}>
        {routes.map(({ component, path, onClick, text, color, abstract, icon, bg, hidden }) => (
          <Route
            path={path}
            children={(arg) => (
              <Component
                {...arg}
                classNames={{
                  enter: styles.thirdEnter,
                  exit: styles.thirdExit,
                }}
                item={() => {
                  if (onClick) {
                    return <Fragment />;
                  }
                  const Container = component();
                  if (hidden) return <Container {...arg} />;
                  return (
                    <div>
                      <div className={styles.info} style={{ backgroundImage: `url(${bg})` }}>
                        <div className={styles.bg} />
                        <div className={styles.textWraper}>
                          <div className={styles.title}>
                            <i className={`iconfont ${icon}`} style={{ color }} />
                            <Texty className={styles.texty} enter={getEnter} leave={getEnter}>
                              {text}
                            </Texty>
                          </div>
                          <div className={styles.abstract}>{abstract}</div>
                        </div>
                      </div>
                      <Container {...arg} />
                    </div>
                  );
                }}
              />
            )}
            key={path}
          />
        ))}
      </div>
    </div>
  );
};
