import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { Loading, renderTime, getCache, setCache } from '@/util/module';
import Pagination from '@/component/pagination';
// import Add from './modal';
import Footer from './component/footer';
import { queryMessage, deleteMsgById, getEmojis } from './service';
import { randomDirction } from './util';
import { getHtml } from './lib/util';
import styles from './index.less';

export default ({ history }) => {
  const [data, setData] = useState([]);
  const [emojiList, setList] = useState(getCache('__emoji__list') || []);
  const [page, setPage] = useState({
    total: 0,
    current: 1,
  });
  const ref = useRef();
  async function queryMsg(pageNo = 1) {
    try {
      // const cacheData = getCache(`messages-${pageNo}`);
      // if (!cacheData) {
      Loading.show();
      // } else {
      // setData(cacheData);
      // setPage({ ...page, current: pageNo });
      // }
      const { data: newData, totalCount } = await queryMessage({
        page: pageNo,
      });
      if (newData && newData.length) {
        // if (JSON.stringify(newData) !== JSON.stringify(cacheData)) {
        setData([...newData.reverse()]);
        // }
      }
      setPage({
        current: pageNo,
        total: totalCount,
      });
      // setCache(`messages-${pageNo}`, newData);
    } catch (error) {
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  }
  const isLogin = Cookies.get('token');
  async function queryEmoji() {
    const { success, emojis } = await getEmojis();
    if (success) {
      setList(emojis);
      setCache('__emoji__list', emojis);
    }
  }
  useEffect(() => {
    queryEmoji();
  }, []);
  useEffect(() => {
    queryMsg();
  }, [ref]);
  if (!data || !data.length)
    return (
      <div ref={ref} className={styles.box}>
        <div className={styles.msgItem} />
        <div className={styles.msgItem} />
        <div className={styles.msgItem} />
      </div>
    );
  const onDelete = async (_id) => {
    if (!isLogin) {
      message.error('未登陆，无法操作');
      return;
    }
    const { success, errorMsg } = await deleteMsgById({ _id });
    if (success) {
      queryMsg(1);
    } else {
      message.error(errorMsg || '操作失败');
    }
  };
  return (
    <div ref={ref} className={styles.box}>
      {/* <Add queryMsg={queryMsg} /> */}
      <div className={styles.page}>
        <Pagination {...page} onChange={(pageNo) => queryMsg(pageNo)} />
      </div>
      <div className={styles.wraper}>
        {data.map(({ avatar, name, content, date, _id, repeat }) => (
          <div className={randomDirction(name) ? styles.msgItem : styles.msgItemRight} key={_id}>
            <div className={styles.msgUserWraper}>
              <img className={styles.avatar} src={avatar} alt=" " />
              <span className={styles.name}>
                <div>
                  {name} <span className={styles.date}>{renderTime(date)}</span>
                  {isLogin && (
                    <a className={styles.delete} onClick={() => onDelete(_id)}>
                      <i className="iconfont icon-deleteitem" />
                    </a>
                  )}
                </div>
                <div>{}</div>
              </span>
            </div>
            <div className={styles.content}>
              <div>
                <span
                  className={styles.tip}
                  dangerouslySetInnerHTML={{ __html: getHtml(content, emojiList) }}
                />
              </div>
              <div className={styles.repeat}>
                {repeat.length !== 0 &&
                  repeat.map((item) => (
                    <div className={styles.repeatItem}>
                      <div className={styles.repeatInfo}>
                        <img className={styles.avatar} src={item.avatar} alt=" " />
                        <span className={styles.name}>
                          <a>
                            {item.name} @ {item.toRepeatUser && item.toRepeatUser.name}
                            {renderTime(item.date)}
                          </a>
                          {/* <a></a> */}
                        </span>
                      </div>
                      <div
                        className={styles.repeatContent}
                        dangerouslySetInnerHTML={{ __html: getHtml(item.info, emojiList) }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer queryMsg={queryMsg} history={history} />
    </div>
  );
};
