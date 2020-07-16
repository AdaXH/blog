import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { useDidMount, useUnmount } from '@/utils/hooks';
import Api from '@/utils/request';
// import { setCache, getCache, hasChange } from '@/utils/functions';
import Login from './components/login';
import Loading from '../../wrapComponent/Loading';
import Aside from './components/aside';
import Tips from './components/tips';
import User from './components/user';
// import { CHACHE_DATA } from './constant';
import styles from './index.less';

export default connect(
  ({ user, loading, dynamic, article, message, blogConfig: { config } }) => ({
    config,
    user,
    loading,
    dynamic,
    article,
    message,
  })
)((props) => {
  const { user, config, dispatch } = props;
  const [state, setState] = useState({ customer: 0 });
  const { customer } = state;
  const dom = useRef({});
  let interval;
  useUnmount(() => clearInterval(interval));
  useDidMount(async () => {
    clearInterval(interval);
    try {
      if (!user.isLogin && !!Cookies.get('user')) {
        dispatch({ type: 'user/getUserInfo', payload: {} });
      }
      dispatch({ type: 'user/customer' }).then((number) => {
        if (number && number !== 0) {
          interval = setInterval(() => {
            setState(({ customer }) => {
              if (customer >= number) {
                clearInterval(interval);
              }
              return { customer: customer >= number ? number : customer + 10 };
            });
            console.log('state');
          });
        }
      });
      Loading.show();
      // await preLoad();
      // async function preLoad() {
      //   for (const item of CHACHE_DATA) {
      //     const result = await Api(item.api);
      //     if (result.success) {
      //       const cacheItem = getCache(item.key) || '{}';
      //       if (hasChange(cacheItem, result.data)) {
      //         setCache(item.key, result.data);
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  });
  const curraneYear = new Date().getFullYear();
  return (
    <div className={styles.indexContainer} ref={dom}>
      <Aside />
      <Tips config={{ ...config, customer }} />
      {Cookies.get('user') && user.isLogin ? (
        <User user={user} dispatch={dispatch} />
      ) : (
        <Login user={user} dispatch={dispatch} />
      )}
      <div className={styles.footerInfo}>
        React Blog © 2018 - {curraneYear} Adaxh
      </div>
    </div>
  );
});
