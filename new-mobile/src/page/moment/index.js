import React, { useState } from 'react';
import { useDidMount } from '@/util/hooks';
// import { getCache, setCache, Loading } from '@/util/module';
import { queryMoments } from './service';
import { mapUrl } from './util';
import styles from './index.less';

export default () => {
  // const cacheData = getCache('moments');
  const [data, setData] = useState();
  useDidMount(async () => {
    try {
      // if (!cacheData) {
      //   Loading.show();
      // }
      const { data: newData } = await queryMoments();
      if (newData && newData.length) {
        setTimeout(() => {
          setData(newData);
        }, 600);
        // setCache('moments', newData);
      }
    } catch (error) {
    } finally {
      // Loading.hide();
    }
  });
  // console.log('data', data);
  if (!data)
    return (
      <div>
        <div className={styles.momentItem} />
        <div className={styles.momentItem} />
        <div className={styles.momentItem} />
      </div>
    );
  return (
    <div>
      <div className={styles.box}>
        {data.map(({ img, title, content, date, upvote, _id }) => (
          <div className={styles.momentItem} key={_id}>
            <div
              className={styles.momentTitleWraper}
              style={{ backgroundImage: `url(${mapUrl(img)})` }}
            >
              {/* <img src={mapUrl(img)} alt=" " /> */}
            </div>
            <div className={styles.momentDesc}>
              <div className={styles.title}>
                <span>{title}</span>
              </div>
              <div className={styles.content}>{content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
