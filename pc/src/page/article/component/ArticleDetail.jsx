import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useDidMount } from '@/utils/hooks';
import Notification from '@/wrapComponent/Notification';
import { getParam, relativeTime, getCache, setCache } from '@/utils/functions';
import Api from '@/utils/request';
import Loading from '@/wrapComponent/Loading';
import ArticleMsg from './articleMsg';
import styles from '../index.less';

export default ({ history, dispatch }) => {
  const [data, setData] = useState({});
  useDidMount(async () => {
    const _id = getParam(history.location.search, 'id');
    if (_id) {
      const cacheData = getCache(`article${_id}`);
      let title = '';
      if (cacheData) {
        setData(cacheData);
        title = cacheData.title;
      } else {
        Loading.show();
      }
      const res = await Api('api/queryArticleById', 'POST', { _id });
      Loading.hide();
      if (res.data) {
        setCache(`article${_id}`, res.data);
        const { isHidden } = res.data;
        if (isHidden) {
          Notification.fail({
            msg: '文章过于久远(内容维护中)，无法访问！',
          });
          return;
        }
        setData(res.data);
        title = res.data.title;
      }
      document.title = `Ada - ${title}`;
    }
    Api('api/updateArticleViewerById', 'POST', { _id });
  });
  const handleClose = () => {
    history.push('/article');
  };
  return (
    <div className={styles.container__}>
      <div className={styles.left} onClick={() => handleClose()}>
        <i className={'icon-fanhui iconfont'} />
      </div>
      <div className={styles.scollHidden}>
        <div className={styles.scrollContainer}>
          <div className={styles.contentWrapper}>
            {data && (
              <div className={styles.contentWrapper__inner}>
                <div className={styles.page}>
                  <div className={styles.info}>
                    <div>类型：{data.type}</div>
                    <div>时间：{relativeTime(data.date)}</div>
                    <div>浏览：{data.viewer}</div>
                  </div>
                  <div className={styles.content}>
                    {data.summary &&
                      ReactHtmlParser(
                        data.summary.replace(
                          /contenteditable="true"+|placeholder="Compose an epic..."+|<\/?br>/g,
                          ''
                        )
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <ArticleMsg data={data.message} articleId={data._id} />
        </div>
      </div>
    </div>
  );
};
