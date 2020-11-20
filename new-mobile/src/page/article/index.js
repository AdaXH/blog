import React, { useState } from 'react';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/module';
import { getArticles } from './service';
import { relativeTime as renderTime } from './util';

import styles from './index.less';

export default ({ history }) => {
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
  const turn2Article = (_id) => {
    history.push('/home/all/article-detail?id=' + _id);
  };
  return (
    <div>
      {data.map(({ link, date, title, viewer, abstract, _id }, index) => {
        return (
          <div className={styles.view} key={_id} onClick={() => turn2Article(_id)}>
            <div className={styles.title}>{title}</div>
            <div className={styles.abstract}>{abstract}</div>
            <div className={styles.articleDesc}>
              <i className="icon-06 iconfont"></i>
              <span>{renderTime(date)}</span>
              <i className="icon-yulan iconfont"></i>
              <span>view: {viewer}</span>
            </div>
          </div>
        );
      })}
      {/* <Route
        path="/home/all/article/article-detail"
        children={(arg) => (
          <Component
            {...arg}
            classNames={{
              enter: styles.secEnter,
              exit: styles.secExit,
            }}
            item={(arg) => <ArticleDetail history={history} {...arg} />}
          />
        )}
        exact
      /> */}
    </div>
  );
};
