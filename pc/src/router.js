import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, Router } from 'dva/router';
import Cookies from 'js-cookie';
import dynamic from 'dva/dynamic';
import PreLoad from '@/wrapComponent/preLoad';
import classnames from 'classnames';
import Api from '@/utils/request';
import { setCache } from '@/utils/functions';
import Dialog from '@/component/dialog/dialog';
import DynamicDetail from '@/page/dynamic/component/dynamicDetail';
import Search from '@/page/search/search';
import Header from '@/page/header/header';
import { getOpenid } from '@/services/thirdApi';
import Body from '@/page/body/body';
import routes from './config/router.config';
import { CHACHE_DATA } from '@/page/index/constant';
import { useDidMount } from './utils/hooks';

import styles from './common/container.less';

export default ({ history }) => {
  window.onload = () => {
    window.preOnload && window.preOnload();
  };
  const [loading, setLoading] = useState(true);
  const [loadStyle, changeLoad] = useState(false);
  useDidMount(async () => {
    async function preLoad() {
      try {
        if (history.location.hash) {
          const [param] = history.location.hash.split('&');
          // eslint-disable-next-line
          const [_, access_token] = param.split('=');
          if (access_token) {
            Cookies.remove('user');
            Cookies.remove('token');
            await getOpenid({ access_token });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
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
  useEffect(() => {
    async function change() {
      setTimeout(() => {
        setLoading(false);
      }, 10);
    }
    if (loadStyle) {
      change();
    }
  }, [loadStyle]);
  const loadClass = classnames({
    [styles.loadFinish]: loadStyle,
  });
  if (loading) return <PreLoad className={loadClass} />;
  function mapRouteMethod(routeArr, app) {
    return routeArr.map(({ path, childRoutes, exact, ...others }) => {
      if (childRoutes) {
        const RendrerComponent = dynamic({ ...others });
        return (
          <Route
            key={path}
            path={path}
            exact={exact}
            render={(props) => {
              return (
                <React.Fragment>
                  {props.children}
                  <RendrerComponent {...props}>
                    {mapRouteMethod(childRoutes)}
                  </RendrerComponent>
                </React.Fragment>
              );
            }}
          />
        );
      }
      return (
        <Route
          key={path}
          path={path}
          exact={exact}
          component={dynamic({
            ...others,
          })}
        />
      );
    });
  }

  return (
    <Router history={history}>
      <div className={styles.container}>
        <DynamicDetail />
        <Dialog />
        <Header />
        <Search />
        <Body />
        <Switch>
          {mapRouteMethod(routes)}
          <Redirect to="/home" />
        </Switch>
      </div>
    </Router>
  );
};
