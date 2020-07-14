import React, { useEffect } from 'react';
import { connect } from 'dva';
import articleStype from '../../config/articleType';
import Loading from '../../wrapComponent/Loading';
import Notification from '../../wrapComponent/Notification';
import { color } from './constant';
import styles from './article.less';
import 'braft-editor/dist/index.css';

const Article = (props) => {
  const { hot, data } = props.article;
  useEffect(() => {
    if (!data) {
      Loading.show();
      props
        .dispatch({ type: 'article/load', payload: {} })
        .finally(() => Loading.hide());
    }
  }, []);
  const extrct = {};
  const extrctArr = [];
  const type = ['All', ...articleStype];
  if (data && data instanceof Array) {
    for (let item of data) {
      !extrct[item.year]
        ? (extrct[item.year] = 1)
        : (extrct[item.year] = extrct[item.year] + 1);
    }
  }
  for (let key in extrct) {
    !type.includes(key) && type.push(key);
    extrctArr.push({ year: key, value: extrct[key] });
  }
  type.push('Time');
  type.push('');
  const random = () => color[Math.floor(Math.random() * color.length)];
  const handleType = ({ nativeEvent: { target } }, item) => {
    const types = document.querySelectorAll('._articleTyle');
    const SLIDE_MARGIN = 50;
    types[types.length - 1].style.transform = `translateX(${
      target.offsetLeft - SLIDE_MARGIN
    }px) translateY(${target.offsetTop - SLIDE_MARGIN}px)`;
    types[types.length - 1].style.width = `${target.offsetWidth + 20}px`;

    if (target.getAttribute('current') === 'true') return;
    for (let _item = 0; _item < types.length; _item++) {
      if (_item < types.length - 1) {
        item && types[_item].setAttribute('current', 'false');
        item && (types[_item].style.cssText = 'color: white; cursor: pointer');
      }
    }
    !!item && item !== 'Time' && target.setAttribute('current', 'true');
    target.style.cssText =
      'color: #f54c53;' + (item !== 'Time' && 'cursor: not-allowed');
    item && props.dispatch({ type: 'article/filter', payload: item });
  };
  function toDetail({ _id, isHidden }) {
    if (isHidden) {
      Notification.fail({ msg: '文章过于久远(内容维护中)，无法访问！' });
      return;
    }
    props.dispatch({ type: 'article/addViewer', _id });
    props.history.push('/article-detail?id=' + _id);
  }
  return (
    <div className={styles.articleContainer}>
      <div className={styles.articleWrap}>
        <ul className={styles.articleList}>
          {data instanceof Array &&
            data.map((item) => {
              if (item.show || !item.hasOwnProperty('show'))
                return (
                  <li
                    onClick={() => toDetail(item)}
                    className={styles.articleItem}
                    key={item._id}
                  >
                    <div
                      className={styles.articleCircle}
                      style={{ backgroundColor: random() }}
                    >
                      {item.type && item.type.slice(0, 1)}
                    </div>
                    <div className={styles.articleDate}>
                      <span>
                        {item.year}-{item.date}
                      </span>
                    </div>
                    <div className={styles.articleTitle}>{item.title}</div>
                  </li>
                );
              else return '';
            })}
        </ul>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.articleFilter}>
          {type.map((item, i) => (
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
            {hot.map((item) => (
              <li
                onClick={() => toDetail(item._id)}
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
export default connect(({ article, loading }) => ({ article, loading }))(
  Article
);
