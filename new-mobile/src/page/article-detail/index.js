import React, { useState } from 'react';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache, Loading } from '@/util/module';
import ReactHtmlParser from 'react-html-parser';
import ArticleMsg from './articleMsg/index';
import { getSearch } from './util';
import { queryArticleById } from './service';
import styles from './index.less';

export default ({ history, match }) => {
  console.log('history', history);
  console.log('match', match);
  const {
    location: { search },
  } = history;
  const { id: _id } = getSearch(search);
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
    <div className={styles.articleBox}>
      <div key={data.title} className={styles.beforeCon}>
        {ReactHtmlParser(summary)}
      </div>
      <ArticleMsg data={message} articleId={_id} />
    </div>
  );
};
