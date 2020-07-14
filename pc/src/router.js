import React, { useState } from 'react';
import { Route, Switch, Redirect, Router } from 'dva/router';
import Dialog from './components/dialog/dialog';
import DynamicDetail from './components/dynamic/dynamicDetail';
import styles from './common/container.less';
import Search from './components/search/search';
import Header from './components/header/header';
import Body from './components/body/body';
import routes from './config/router.config';
import classnames from 'classnames';
import { useDidMount } from './utils/hooks';

export default ({ history }) => {
  window.onload = () => {
    window.preOnload && window.preOnload();
  };
  const [isAnother, changeStyle] = useState(false);
  useDidMount(() => {
    history.listen(() => {
      const {
        location: { pathname },
      } = history;
      changeStyle(pathname === '/friend-ship');
    });
  });
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
