import React from 'react';
import s from './search.less';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import ReactHtmlParser from 'react-html-parser';

const Search = props => {
  const {
    search: { visible, result },
    dispatch,
    history,
  } = props;
  const handleClick = data => {
    const { type, _id } = data;
    if (type === '文章') {
      dispatch({ type: 'dynamic/closeDetail' });
      dispatch({
        type: 'article/addViewer',
        _id,
      });
      onMask();
      history.push('/article/' + _id);
    } else {
      dispatch({
        type: 'dynamic/dynamicDetail',
        payload: _id,
      });
    }
  };

  const onMask = () => {
    dispatch({ type: 'search/close' });
    dispatch({ type: 'dynamic/closeDetail' });
  };

  return (
    <div>
      {visible ? (
        <div className={s.searchMask1}>
          <div className={s.searchMask2} onClick={onMask} />
          <div className={s.searchContainer}>
            <div className={s.searchHeader}>
              <ul>
                <li>类型</li>
                <li>摘要</li>
                <li>时间</li>
              </ul>
            </div>
            <div className={s.resultWrap}>
              <ul>
                {result.map(item => (
                  <li key={item._id} onClick={() => handleClick(item)}>
                    <span>{item.type}</span>
                    <span>
                      {item.type === '文章'
                        ? ReactHtmlParser(item.summary)
                        : item.summary}
                    </span>
                    <span>{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default connect(({ loading, search }) => ({ loading, search }))(
  withRouter(Search)
);
