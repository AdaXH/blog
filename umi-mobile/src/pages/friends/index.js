import { useState } from 'react';
import classnames from 'classnames';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/functions';
import { queryFriends } from './service';
import { setStyle } from './util';

import styles from './index.less';

export default ({ theme }) => {
  const cacheData = getCache('friends') || [];
  const [data, setData] = useState(cacheData);
  useDidMount(async () => {
    const { success, data: res } = (await queryFriends()) || {};
    if (success) {
      if (cacheData) {
        if (JSON.stringify(cacheData) !== JSON.stringify(res)) {
          setCache('friends', res);
          setData(res);
        }
      } else {
        setData(res);
      }
    }
  });
  const cla = classnames({
    [styles[theme]]: true,
    [styles.itemF]: true,
  });
  return (
    <div className={cla}>
      {/* <div className={styles.siteTitle}>友情链接</div> */}
      <div className={styles.friendItem}>
        <div className={styles.view}>
          <div className={styles.title}>友情链接</div>
        </div>
      </div>
      {data
        .filter(item => item.verify)
        .map(({ link, desc, title, icon }, index) => {
          return (
            <a
              className={styles.friendItem}
              key={link}
              style={setStyle(index)}
              href={link}
              target="blank"
            >
              <div className={styles.avatar}>
                <img src={icon} alt="icon" />
              </div>
              <div className={styles.view}>
                <div className={styles.title}>{title}</div>
                <div className={styles.desc}>{desc}</div>
              </div>
            </a>
          );
        })}
    </div>
  );
};
