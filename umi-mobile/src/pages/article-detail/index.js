import React, { useState } from 'react';
import { useDidMount } from '@/util/hooks';
import Loading from '@/component/loading';
import { getCache, setCache } from '@/util/functions';
import ReactHtmlParser from 'react-html-parser';
import ArticleMsg from './articleMsg/index';
import { queryArticleById } from './service';
import styles from './index.less';

export default ({ history }) => {
  const {
    location: {
      query: { id: _id },
    },
  } = history;
  const [data, setData] = useState({});
  useDidMount(async () => {
    if (_id) {
      const cacheData = getCache(`article${_id}`);
      if (cacheData) {
        setData(cacheData);
      } else {
        Loading.show();
      }
      const res = await queryArticleById({ _id });
      Loading.hide();
      if (res.data) {
        setCache(`article${_id}`, res.data);
        const { isHidden } = res.data;
        if (isHidden) {
          res.data.summary = '文章过于久远(内容维护中)，无法访问！';
        }
        setData(res.data);
        if (res.data.title) {
          document.title = `Ada - ${res.data.title}`;
        }
      }
    }
  });
  const { summary, message } = data;
  return (
    <div className={styles.content}>
      <div>{ReactHtmlParser(summary)}</div>
      <ArticleMsg data={message} articleId={_id} />
    </div>
  );
};
