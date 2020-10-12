import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { useDidMount, useUnmount } from '@/utils/hooks';
// import Api from '@/utils/request';
// import { setCache, getCache, hasChange } from '@/utils/functions';
import Login from './components/login';
// import Loading from '../../wrapComponent/Loading';
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
)(props => {
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
      const number = await dispatch({ type: 'user/customer' });
      if (number) {
        interval = setInterval(() => {
          setState(({ customer }) => {
            if (customer >= number) {
              clearInterval(interval);
            }
            return { customer: customer >= number ? number : customer + 10 };
          });
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      // Loading.hide();
    }
  });
  const curraneYear = new Date().getFullYear();
  const Component = Cookies.get('user') && user.isLogin ? User : Login;
  return (
    <div className={styles.indexContainer} ref={dom}>
      <Aside />
      <Tips config={{ ...config, customer }} />
      <Component user={user} dispatch={dispatch} />
      <div className={styles.footerInfo}>
        React Blog © 2018 - {curraneYear} Adaxh
      </div>
    </div>
  );
});
