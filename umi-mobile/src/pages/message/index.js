import { useState } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/functions';
import Loading from '@/component/loading';
import Repeat from './repeat';
import Reply from './reply/index';
import { queryMessage } from './service';
import { setStyle, relativetime } from './util';

import styles from './index.less';
const MAX_SIZE = 5;
export default ({ theme, user, dispatch }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState({
    current: 1,
    total: 10,
  });
  async function query(pageNo = 1) {
    const cacheData = getCache('messages' + pageNo) || [];
    if (cacheData.length) {
      setData(cacheData);
      setPage({
        ...page,
        current: pageNo,
      });
    } else {
      Loading.show();
    }
    const { success, data: res, totalCount } = (await queryMessage({ page: pageNo, pageSize: MAX_SIZE })) || {};
    if (success) {
      setCache('messages' + pageNo, res);
      setData(res || []);
      setPage({
        current: pageNo,
        total: totalCount,
      });
    }
    Loading.hide();
  }
  useDidMount(() => {
    query();
    if (!user.isLogin) {
      dispatch({
        type: 'user/getUserInfo',
      });
    }
  });
  const toggleMsg = (_id) => {
    data.forEach((item) => {
      if (item._id === _id) {
        item.toggle = !item.toggle;
      }
    });
    setData([...data]);
  };
  const cla = classnames({
    [styles[theme]]: true,
    [styles.itemF]: true,
  });
  const newSave = (newItem) => {
    setData([newItem, ...data]);
    setCache('messages', [newItem, ...data]);
  };
  const { total, current } = page;
  const maxPage = total / MAX_SIZE;
  const onPre = () => {
    if (current === 1) return;
    query(current - 1);
  };
  const onNext = () => {
    if (current >= maxPage) return;
    query(current + 1);
  };
  return (
    <>
      <Reply user={user} save={query} />
      <div className={styles.page}>
        <a disabled={current === 1} onClick={onPre}>
          <Icon type="swap-left" />
          <span>pre</span>
        </a>
        <a disabled={current >= maxPage} onClick={onNext}>
          <Icon type="swap-right" />
          <span>next</span>
        </a>
      </div>
      <div className={cla}>
        {data.map(({ _id, avatar, content, name, repeat, date, toggle }, index) => {
          return (
            <div className={styles.friendItem} key={_id} style={setStyle(index)}>
              <div className={styles.avatar}>
                <img src={avatar} alt="icon" />
              </div>
              <div className={styles.view}>
                <div className={styles.title}>
                  {name}: <span className={styles.date}>{relativetime(date)}</span>
                </div>
                <div className={styles.desc}>
                  {content}
                  <span onClick={() => toggleMsg(_id)}>
                    <i className="iconfont icon-message"></i>
                    {repeat.length}
                  </span>
                </div>
              </div>
              {toggle && repeat && <Repeat repeat={repeat} />}
            </div>
          );
        })}
      </div>
    </>
  );
};
