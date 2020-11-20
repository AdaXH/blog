import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Checkbox } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { useDidMount } from '@/utils/hooks';
import { setCache, getCache, hasChange } from '@/utils/functions';
import Pagination from '@/component/pagination/newPagination';
import Notification from '@/wrapComponent/Notification';
import { EMOJI_CACHE_KEY } from '@/utils/constant';
import { getAllMessage, getEmojis } from './service';
import Loading from '../../wrapComponent/Loading';
import MsgItem from './component/msgItem';
import FlyMsg from './component/flyMsg';
import TextDialog from './component/textArea';
// import { escapeData } from './util';
// import { leaveMessage } from './service';
import { MAX_PAGE_COUNT } from './constant';
import styles from './index.less';

const Message = (props) => {
  const { dispatch, user } = props;
  const [current, setCurrent] = useState(1);
  const [quickReply, changeQuick] = useState(!Cookies.get('user'));
  const [total, setTotal] = useState(getCache('totalCount') || 6);
  const [data, setData] = useState(getCache(`message-${current}`) || []);
  const [emojiList, setList] = useState(getCache(EMOJI_CACHE_KEY) || []);
  const [info, setInfo] = useState({
    type: 'leaveMsg',
  });
  const container = useRef({});
  async function fetchData(page = current) {
    const key = `message-${page}`;
    const oldData = getCache(key);
    if (container.current) {
      container.current.scrollTop = 0;
    }
    if (oldData) {
      setData(oldData);
      setCurrent(page);
    } else {
      Loading.show();
    }
    const result = await getAllMessage({
      page: page,
      pageSize: MAX_PAGE_COUNT,
    });
    if (result.success) {
      const { totalCount, data: newData } = result;
      if (hasChange(oldData, newData)) {
        setCache(key, data);
        setData(newData);
        setCache(key, newData);
        setTotal(totalCount);
        setCurrent(page);
        Loading.hide();
      }
    }
  }
  useEffect(() => {
    setCache('totalCount', total);
  }, [total]);
  useDidMount(async () => {
    try {
      const { success, emojis } = await getEmojis();
      if (success) {
        setList(emojis);
        setCache(EMOJI_CACHE_KEY, emojis);
      }
      await fetchData();
      await dispatch({ type: 'user/getUserInfo', payload: {} });
    } catch (error) {}
  });

  const handleClickWarp = ({ nativeEvent: { target } }) => {
    if (/wrapContainer+|addMsgCon/.test(target.className)) {
      dispatch({ type: 'message/init' });
    }
  };
  const deleteMsgCallback = () => {
    // setData(data.filter((item) => item._id !== _id));
    fetchData();
  };
  // 更新回复
  const updateRepeat = (_id, newRepeat) => {
    setData(
      data.map((item) => {
        if (item._id === _id) {
          item.repeat = newRepeat;
        }
        return {
          ...item,
        };
      })
    );
  };
  const checkLogin = user.isLogin && Cookies.get('user');
  const checkLeaveMsg = () => {
    if (!quickReply && !checkLogin) {
      Notification.fail({ msg: '请先登录或勾选快捷留言' });
      return;
    }
    // 打开输入框
    setInfo({
      visible: true,
      type: 'leaveMsg',
      cb: async () => await fetchData(1),
    });
  };
  const onChangeQuick = (e) => {
    e.stopPropagation();
    changeQuick(e.target.checked);
  };
  const style = {
    textAlign: !checkLogin ? 'left' : 'center',
    lineHeight: !checkLogin ? 'unset' : '50px',
    width: !checkLogin ? '100%' : 'unset,',
  };
  const callLeave = useCallback((_id, toRepeat, toRepeatId) => {
    setInfo({
      visible: true,
      type: 'repeat',
      toRepeat,
      toRepeatId,
      cb: updateRepeat,
      _id,
    });
  }, []);
  return (
    <div className={styles.messageContainer}>
      {info.visible && (
        <TextDialog
          info={info}
          quickReply={quickReply}
          setInfo={setInfo}
          emojiList={emojiList}
        />
      )}
      <FlyMsg data={data} emojiList={emojiList} />
      <div className={styles.wrapContainer} onClick={(e) => handleClickWarp(e)}>
        <div className={styles.addMsgCon}>
          <div className={styles.dot} />
          <div className={styles.dotToLine} />
          <div className={styles.dotToLine2} />
          <div className={styles.addMsg}>
            <span
              style={style}
              className={styles.replayEntry}
              onClick={checkLeaveMsg}
            >
              点击留言
            </span>
            {!checkLogin && (
              <Checkbox
                className={styles.quick}
                checked={quickReply}
                onChange={onChangeQuick}
              >
                快捷留言，无需登录
              </Checkbox>
            )}
          </div>
        </div>
        <div className={styles.messageListWrap}>
          <ul className={styles.mssageList} ref={container}>
            {data.map((item, index) => (
              <MsgItem
                item={item}
                index={index}
                key={item._id}
                user={user}
                deleteMsgCallback={deleteMsgCallback}
                callLeave={callLeave}
                emojiList={emojiList}
              />
            ))}
          </ul>
        </div>
        <div className={styles.pagination}>
          {data.length !== 0 && (
            <Pagination
              total={total}
              pageSize={MAX_PAGE_COUNT}
              current={current}
              onChange={(page) => fetchData(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({
  user,
}))(Message);
