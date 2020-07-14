import { useState } from 'react';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/functions';
import classnames from 'classnames';
import { queryMoments, upvoteMoment } from './service';
import { setStyle } from './util';

import styles from './index.less';

export default ({ theme }) => {
  const cacheData = getCache('moments') || [];
  const [data, setData] = useState(cacheData);
  useDidMount(async () => {
    const { success, data: res } = (await queryMoments()) || {};
    if (success) {
      if (cacheData) {
        if (JSON.stringify(cacheData) !== JSON.stringify(res)) {
          setCache('moments', res);
          setData(res);
        }
      } else {
        setData(res);
      }
    }
  });
  const onUpvote = async _id => {
    const upvoteIds = getCache('upvoteIds') || [];
    if (upvoteIds.includes(_id)) return;
    const { success } = (await upvoteMoment(_id)) || {};
    if (success) {
      setCache('upvoteIds', [...upvoteIds, _id]);
      data.forEach(item => {
        if (item._id === _id) {
          item.upvote += 1;
        }
      });
      setData([...data]);
    }
  };
  const cla = classnames({
    [styles[theme]]: true,
    [styles.itemF]: true,
  });
  return (
    <div className={cla}>
      <a className={styles.friendItem}>
        <div className={styles.view}>
          <div className={styles.title}>动态</div>
        </div>
      </a>
      {data.map(({ _id, content, title, img, upvote = 0 }, index) => {
        return (
          <div className={styles.friendItem} key={_id} style={setStyle(index)}>
            <div className={styles.avatar}>
              <img src={img} alt="icon" />
            </div>
            <div className={styles.view}>
              <div className={styles.title}>
                {title}
                <span onClick={() => onUpvote(_id)}>
                  <svg className="icon" aria-hidden="true">
                    <use href="#icon-mengbanhangkonghangtian-xingxingstar"></use>
                  </svg>
                  {upvote}
                </span>
              </div>
              <div className={styles.desc}>{content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
