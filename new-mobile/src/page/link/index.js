import React, { useState } from 'react';
import { useDidMount } from '@/util/hooks';
import { getCache } from '@/util/module';
import Add from './modal';
import { queryFriends } from './service';

import styles from './index.less';

export default ({ theme }) => {
  const cacheData = getCache('friends') || [];
  const [data, setData] = useState(cacheData);
  useDidMount(async () => {
    const { success, data: res } = (await queryFriends()) || {};
    if (success) {
      if (cacheData) {
        if (JSON.stringify(cacheData) !== JSON.stringify(res)) {
          setData(res);
        }
      } else {
        setData(res);
      }
    }
  });
  return (
    <React.Fragment>
      <Add />
      <div className={styles.itemF}>
        {data
          .filter((item) => item.verify)
          .map(({ link, desc, title, icon }) => {
            return (
              <div className={styles.friendItem} key={link} onClick={() => window.open(link)}>
                <img className={styles.avatar} src={icon} alt=" " />
                <div className={styles.view}>
                  <div className={styles.wraper}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.desc}>{desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
};
