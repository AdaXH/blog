import React, { useEffect } from 'react';
import { connect } from 'dva';
import Loading from '../../wrapComponent/Loading';
import Pagination from './../pagination/pagination';
import styles from './dynamic.less';

const Dynamic = props => {
  const {
    dynamic: { dynamic },
    dispatch,
  } = props;
  useEffect(() => {
    if (!dynamic || !dynamic.length) {
      Loading.show();
      dispatch({ type: 'user/getUserInfo', payload: {} });
      dispatch({ type: 'dynamic/load', payload: {} }).finally(() =>
        Loading.hide()
      );
    }
  }, []);
  const handlePage = index => {
    dispatch({ type: 'dynamic/closeDetail' });
    const SINGLE_PAGE_DATA_COUNT = 6;
    randomItem();
    randromCurrent(
      (index - 1) * SINGLE_PAGE_DATA_COUNT,
      (index - 1) * SINGLE_PAGE_DATA_COUNT + 5
    );
  };

  const randomItem = () => {
    const lis = document.querySelectorAll('._dynamicItem');
    if (!!lis) {
      for (let i = 0; i < lis.length; i++) {
        const x = (Math.random() + 1) * 500;
        const op = parseInt(x, 10) % 2 === 0 ? -1 : 1;
        const y = (Math.random() + 1) * 300;
        lis[i].style.opacity = '0';
        lis[
          i
        ].style.transform = `translateX(${x}px) translateZ(${x}px) translateY(${op *
          y}px)`;
        lis[i].style.display = 'none';
      }
    }
  };

  const randromCurrent = (start = 0, end = 5) => {
    const lis = document.getElementsByClassName('_dynamicItem');
    if (!!lis) {
      for (let _start = start; _start <= end; _start++) {
        if (lis[_start]) {
          const duration = Math.random() * 3;
          lis[_start].style.display = 'block';
          lis[_start].style.opacity = '1';
          setTimeout(() => {
            lis[_start].style['transition-duration'] = duration + 's';
            lis[_start].style.transform = `translate3d(0,0,0)`;
          }, 0);
        }
      }
    }
  };

  const toDynamicDetail = _id => {
    dispatch({
      type: 'dynamic/dynamicDetail',
      payload: _id,
    });
  };

  return (
    <div className={styles.dynamicContainer}>
      {dynamic && dynamic.length && (
        <ul className={styles.container}>
          {dynamic.map((item, index) => (
            <li
              onClick={() => toDynamicDetail(item._id)}
              style={{ display: index > 5 ? 'none' : 'block' }}
              className={`${styles.dynamicItem} _dynamicItem`}
              key={item._id}
            >
              <div
                className={styles.dynamicBg}
                style={{ backgroundImage: 'url(' + item.img + ')' }}
              />
              <div className={styles.dynamicContent}>
                <div className={styles.dynamicTitle}>{item.title}</div>
                <div className={styles.dynamicSummary}>{item.content}</div>
              </div>
              <div className={styles.dynamicDate}>{item.date}</div>
            </li>
          ))}
        </ul>
      )}
      <ul className={styles.pageNation}>
        {dynamic && dynamic.length && dynamic.length && (
          <Pagination
            total={dynamic.length}
            pageSize={6}
            onChange={page => handlePage(page)}
          />
        )}
      </ul>
    </div>
  );
};

export default connect(({ dynamic, dialog, loading, user }) => ({
  dynamic,
  dialog,
  loading,
  user,
}))(Dynamic);
