import React, { useState, useEffect, useRef } from 'react';
import { Checkbox } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import { useDidMount } from '@/utils/hooks';
import { setCache, getCache, hasChange } from '@/utils/functions';
import { getAllMessage } from './service';
import Pagination from '@/component/pagination/newPagination';
import Loading from '../../wrapComponent/Loading';
import Notification from '../../wrapComponent/Notification';
import MsgItem from './component/msgItem';
import FlyMsg from './component/flyMsg';
import { escapeData } from './util';
import { leaveMessage } from './service';
import { MAX_PAGE_COUNT } from './constant';
import styles from './index.less';

const Message = (props) => {
  const { dispatch, user } = props;
  const [current, setCurrent] = useState(1);
  const [quickReply, changeQuick] = useState(!Cookies.get('user'));
  const [total, setTotal] = useState(getCache('totalCount') || 6);
  const [data, setData] = useState(getCache(`message-${current}`) || []);
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
      await fetchData();
      await dispatch({ type: 'user/getUserInfo', payload: {} });
    } catch (error) {}
  });

  const leaveMsg = (type, _id, toRepeat) => {
    const cb = async (value) => {
      if (!value || value.trim() === '')
        Notification.fail({
          msg: '输入不规范',
        });
      else {
        if (type === 'leaveMsg') {
          const msg = escapeData(value);
          const extraParam = {};
          if (!_id) {
            extraParam.name = user.name || Base64.decode(Cookies.get('user'));
          }
          const result = await leaveMessage({
            date: Date.now(),
            content: msg,
            // name,
            ...extraParam,
            quickReply: _id,
          });
          if (result.success) {
            await fetchData(1);
            await dispatch({ type: 'dialog/hide' });
          } else {
            Notification.fail({
              msg: result.errorMsg || result || '留言失败',
            });
          }
        } else if (type === 'repeat') {
          dispatch({
            type: 'message/repeatMsg',
            payload: {
              _id,
              info: escapeData(value),
              toRepeat,
            },
          }).then((result) => {
            !result.success && Notification.fail({ msg: result });
            result.success && dispatch({ type: 'dialog/hide' });
          });
        }
      }
    };
    dispatch({
      type: 'dialog/open',
      payload: {
        placeholder:
          type === 'repeat' ? '回复' + toRepeat + ': ' : '在这里写下留言',
        cb,
        maxInput: 100,
      },
    });
  };
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
    !quickReply && !checkLogin
      ? Notification.fail({ msg: '请先登录或勾选快捷留言' })
      : leaveMsg('leaveMsg', !checkLogin && quickReply);
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
  return (
    <div className={styles.messageContainer}>
      <FlyMsg data={data} />
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
                dispatch={dispatch}
                updateRepeat={updateRepeat}
              />
            ))}
          </ul>
        </div>
        <div className={styles.pagination}>
          {data.length && (
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
