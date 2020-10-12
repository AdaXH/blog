import { useState } from 'react';
import classnames from 'classnames';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/functions';
import { getArticles } from './service';
import { relativeTime } from './util';

import styles from './index.less';

export default ({ theme, history }) => {
  const cacheData = getCache('articles') || [];
  const [data, setData] = useState(cacheData);
  useDidMount(async () => {
    const { success, data: res } = (await getArticles()) || {};
    if (success) {
      if (cacheData) {
        if (JSON.stringify(cacheData) !== JSON.stringify(res)) {
          setCache('articles', res);
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
  const turn2Article = (_id) => {
    history.push('/article-detail?id=' + _id);
  };
  return (
    <div className={cla}>
      {data.map(({ link, date, title, viewer, abstract, _id }, index) => {
        return (
          <a className={styles.friendItem} key={_id} onClick={() => turn2Article(_id)}>
            <div className={styles.view}>
              <div className={styles.title}>{title}</div>
              <div className={styles.abstract}>{abstract}</div>
              <div className={styles.desc}>
                <i className="icon-06 iconfont"></i>
                <span>{relativeTime(date)}</span>
                <i className="icon-yulan iconfont"></i>
                <span>{viewer}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};
