import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useDidMount } from '@/util/hooks';
import { getUserInfo } from './service';
import { removeInfo } from './util';
import styles from './index.less';

export default ({ history }) => {
  // const [loginFinish, setStatus] = useState(false);
  const [user, setUser] = useState({});
  useDidMount(async () => {
    // console.log('history', history);
    try {
      const token = Cookies.get('token');
      if (!token) {
        window.QC.Login.showPopup({
          appId: '101902433',
          redirectURI: 'https://www.adaxh.site/qq',
        });
        return;
      }
      const { user: getUser } = await getUserInfo();
      if (getUser) {
        setUser(getUser);
      }
    } catch (error) {
      console.log('error', error);
    }
  });
  const { name, avatar } = user;
  if (!name) return <div className={styles.box} />;
  const exit = () => {
    removeInfo();
    // window.location.reload();
    history.push('/');
  };
  return (
    <div className={styles.box}>
      <div className={styles.user}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
        <div className={styles.name}>
          <span>{name}</span>
          <a onClick={exit}>exit</a>
        </div>
      </div>
    </div>
  );
};
