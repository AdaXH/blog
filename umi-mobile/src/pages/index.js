// import Nav from '@/pages/component/header';
import { useState } from 'react';
import Home from '@/pages/component/home';
import Loading from '@/component/load';
import { setCache, getCache } from '@/util/functions';
import { useDidMount } from '@/util/hooks';
import request from '@/util/request';
import styles from './index.less';

export default props => {
  const [loading, change] = useState(true);
  useDidMount(async () => {
    const cacheData = [
      {
        api: '/api/getDynamic',
        data: getCache('moments'),
        key: 'moments',
      },
      {
        api: '/api/getAllMessages',
        data: getCache('messages'),
        key: 'messages',
      },
      {
        api: '/api/queryFriends',
        data: getCache('friends'),
        key: 'friends',
      },
    ];
    for await (const item of cacheData) {
      if (!item.data) {
        const result = await request(item.api);
        if (result.success) {
          setCache(item.key, result.data);
        }
      }
    }
    change(false);
  });
  if (loading) return <Loading />;
  return (
    <>
      <Home {...props} />
      <div className={styles.tip}>移动端没怎么写，完整交互在pc</div>
    </>
  );
};
