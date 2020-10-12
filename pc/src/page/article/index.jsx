import React, { useState } from 'react';
import { setCache, getCache, hasChange, relativeTime } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { getArticles } from '@/utils/service';
import Loading from '@/wrapComponent/Loading';
import Notification from '@/wrapComponent/Notification';
import { color } from './constant';
import {
  filterData,
  getHotArticle,
  changeUnderline,
  getArticleType,
} from './util';
import styles from './index.less';
// import 'braft-editor/dist/index.css';

export default ({ history }) => {
  const [data, setData] = useState(getCache('articles') || []);
  const [articleType, changeType] = useState('All');
  useDidMount(async () => {
    if (!data.length) Loading.show();
    const result = await getArticles();
    if (result.success) {
      if (hasChange(data, result.data)) {
        setCache('articles', result.data);
        setData(result.data);
      }
    }
    Loading.hide();
  });
  const random = () => color[Math.floor(Math.random() * color.length)];
  const handleType = ({ nativeEvent: { target } }, item) => {
    changeUnderline(target, item, () => changeType(item));
  };
  function toDetail({ _id, isHidden }) {
    if (isHidden) {
      Notification.fail({ msg: '文章过于久远(内容维护中)，无法访问！' });
      return;
    }
    history.push('/article-detail?id=' + _id);
  }
  // 按文章分类展示
  const viewData = filterData(data, articleType);
  return (
    <div className={styles.articleContainer}>
      <div className={styles.articleWrap}>
        <ul className={styles.articleList}>
          {viewData.map((item) => {
            if (item.show || !item.hasOwnProperty('show'))
              return (
                <li
                  onClick={() => toDetail(item)}
                  className={styles.articleItem}
                  key={item._id}
                >
                  <div className={styles.cirCon}>
                    <div
                      className={styles.articleCircle}
                      style={{ backgroundColor: random() }}
                    >
                      <span className={styles.type}>
                        {item.type && item.type.substr(0, 1)}
                      </span>
                      <span className={styles.date}>
                        {relativeTime(item.date)}
                      </span>
                      {/* <div className={styles.showType}>{item.type}</div> */}
                    </div>
                  </div>
                  <div className={styles.articleTitle}>
                    <div>{item.title}</div>
                    <div className={styles.abstract}>{item.abstract}</div>
                  </div>
                </li>
              );
            return null;
          })}
        </ul>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.articleFilter}>
          {getArticleType(data).map((item, i) => (
            <div
              current={i === 0 ? 'true' : 'false'}
              className="_articleTyle"
              onClick={(e) => handleType(e, item)}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.downContainer}>
          <div className={styles.hotTitle}>Hot</div>
          <ul className={styles.hotList}>
            {getHotArticle(data).map((item) => (
              <li
                onClick={() => toDetail(item)}
                className={styles.hotItem}
                key={item._id}
              >
                <div className={styles.hotFire}>
                  <i className="iconfont icon-aixin" />
                </div>
                <div className={styles.hotTitle}>{item.title}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
