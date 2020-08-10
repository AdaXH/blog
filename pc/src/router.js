import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, Router } from 'dva/router';
import PreLoad from '@/wrapComponent/preLoad';
import Api from '@/utils/request';
import { setCache } from '@/utils/functions';
import { FULL_SCREEN_PATH } from '@/utils/constant';
import Dialog from './components/dialog/dialog';
import DynamicDetail from './components/dynamic/component/dynamicDetail';
import styles from './common/container.less';
import Search from './components/search/search';
import Header from './components/header/header';
import Body from './components/body/body';
import routes from './config/router.config';
import classnames from 'classnames';
import { useDidMount } from './utils/hooks';
import { CHACHE_DATA } from './components/index/constant';

export default ({ history }) => {
  window.onload = () => {
    window.preOnload && window.preOnload();
  };
  const [isAnother, changeStyle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadStyle, changeLoad] = useState(false);
  useDidMount(async () => {
    history.listen(() => {
      const {
        location: { pathname },
      } = history;
      changeStyle(FULL_SCREEN_PATH.includes(pathname));
    });
    async function preLoad() {
      for (const item of CHACHE_DATA) {
        const result = await Api(item.api, item.method || 'GET');
        if (result.success) {
          setCache(item.key, result.data);
          if (item.extraKey) {
            setCache(item.extraKey, result[item.extraKey]);
          }
        }
      }
    }
    await preLoad();
    changeLoad(true);
    // await delay(2);
  });
  useEffect(
    () => {
      async function change() {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
      if (loadStyle) {
        change();
      }
    },
    [loadStyle]
  );
  const loadClass = classnames({
    [styles.loadFinish]: loadStyle,
  });
  if (loading) return <PreLoad className={loadClass} />;
  return (
    <Router history={history}>
      <div className={styles.container}>
        <DynamicDetail />
        <Dialog />
        <Header />
        <Search />
        <Body />
        <section
          className={classnames({
            [styles.anotherWorldSection]: isAnother,
          })}
        >
          <Switch>
            {routes.map(route => {
              const { path, Component, exact } = route;
              const cfg = {
                path,
                key: path,
                exact,
                component: Component(),
              };
              return <Route {...cfg} />;
            })}
            <Redirect to="/home" />
          </Switch>
        </section>
      </div>
    </Router>
  );
};
