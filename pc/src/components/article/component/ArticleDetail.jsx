import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useDidMount } from '@/utils/hooks';
import Notification from '@/wrapComponent/Notification';
import { getParam, relativeTime } from '@/utils/functions';
import Api from '@/utils/request';
import Loading from '@/wrapComponent/Loading';
import styles from '../index.less';

export default ({ history, dispatch }) => {
  const [data, setData] = useState();
  useDidMount(async () => {
    const _id = getParam(history.location.search, 'id');
    if (_id) {
      Loading.show();
      Api('api/updateArticleViewerById', 'POST', { _id });
      const res = await Api('api/queryArticleById', 'POST', { _id });
      Loading.hide();
      if (res.data) {
        const { isHidden } = res.data;
        if (isHidden) {
          Notification.fail({
            msg: '文章过于久远(内容维护中)，无法访问！',
          });
          return;
        }
        setData(res.data);
      }
    }
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
                    {ReactHtmlParser(
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
        </div>
      </div>
    </div>
  );
};
