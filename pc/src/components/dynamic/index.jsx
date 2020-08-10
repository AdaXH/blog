import React, { useState } from 'react';
import { connect } from 'dva';
import { setCache, getCache, hasChange } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { getDynamic } from '@/utils/service';
import Loading from '../../wrapComponent/Loading';
import Pagination from '../pagination/pagination';
import { randomItem, randromCurrent, relativetime } from './util';
import styles from './index.less';

const Dynamic = (props) => {
  const { dispatch, user } = props;
  const [data, setData] = useState(getCache('moments') || []);
  useDidMount(async () => {
    if (!user.isLogin) {
      await dispatch({ type: 'user/getUserInfo', payload: {} });
    }
    if (!data.length) Loading.show();
    const result = await getDynamic();
    if (result.success) {
      if (hasChange(data, result.data)) {
        setCache('moments', result.data);
        setData(result.data);
      }
    }
    Loading.hide();
  });
  const handlePage = (index) => {
    dispatch({ type: 'dynamic/closeDetail' });
    const SINGLE_PAGE_DATA_COUNT = 6;
    randomItem();
    randromCurrent(
      (index - 1) * SINGLE_PAGE_DATA_COUNT,
      (index - 1) * SINGLE_PAGE_DATA_COUNT + 5
    );
  };

  const toDynamicDetail = (payload) => {
    dispatch({ type: 'dynamic/dynamicDetail', payload });
  };

  if (!data) return null;
  return (
    <div className={styles.dynamicContainer}>
      <ul className={styles.container}>
        {data.map((item, index) => (
          <li
            onClick={() => toDynamicDetail(item)}
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
              <div className={styles.dynamicSummary}>
                <div>{relativetime(item.date)}</div>
                <div>{item.content}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ul className={styles.pageNation}>
        <Pagination
          total={data.length}
          pageSize={6}
          onChange={(page) => handlePage(page)}
        />
      </ul>
    </div>
  );
};

export default connect(({ user }) => ({ user }))(Dynamic);
