import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import { setCache, getCache, hasChange } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { getAllMessages } from '@/utils/service';
import Pagination from '../pagination/pagination';
import Loading from '../../wrapComponent/Loading';
import Notification from '../../wrapComponent/Notification';
import MsgItem from './component/msgItem';
import FlyMsg from './component/flyMsg';
import { escapeData, getDate } from './util';
import { leaveMessage } from './service';
import { MAX_PAGE_COUNT } from './constant';
import styles from './index.less';

const Message = props => {
  const { dispatch, user } = props;
  const [data, setData] = useState(getCache('messages') || []);
  const [current, setCurrent] = useState(1);
  useDidMount(async () => {
    try {
      if (!data.length) Loading.show();
      const result = await getAllMessages();
      if (result.success) {
        if (hasChange(data, result.data)) {
          setCache('messages', result.data);
          setData(result.data);
        }
      }
      await dispatch({ type: 'user/getUserInfo', payload: {} });
    } catch (error) {
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  });
  useEffect(
    () => {
      setCache('messages', data);
    },
    [data]
  );
  const handlePage = page => {
    const wrapList = document.querySelector('.' + styles.mssageList);
    if (wrapList) wrapList.scrollTop = 0;
    setCurrent(page);
  };

  const leaveMsg = (type, _id, toRepeat) => {
    const cb = async value => {
      if (!value || value.trim() === '')
        Notification.fail({
          msg: '输入不规范',
        });
      else {
        if (type === 'leaveMsg') {
          const msg = escapeData(value);
          const name = user.name || Base64.decode(Cookies.get('user'));
          const result = await leaveMessage({
            date: getDate(),
            content: msg,
            name,
          });
          if (result.success) {
            const newData = [result.data, ...data];
            await setData(newData);
            await handlePage(1, newData);
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
          }).then(result => {
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
          type === 'repeat' ? '回复' + toRepeat + ': ' : '在这里写下宝贵的留言',
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
  const deleteMsgCallback = _id => {
    setData(data.filter(item => item._id !== _id));
  };
  // 更新回复
  const updateRepeat = (_id, newRepeat) => {
    setData(
      data.map(item => {
        if (item._id === _id) {
          item.repeat = newRepeat;
        }
        return {
          ...item,
        };
      })
    );
  };
  const checkLeaveMsg = () => {
    !user.isLogin && !Cookies.get('user')
      ? Notification.fail({ msg: '请先登录' })
      : leaveMsg('leaveMsg');
  };
  return (
    <div className={styles.messageContainer}>
      <FlyMsg data={data} />
      <div className={styles.wrapContainer} onClick={e => handleClickWarp(e)}>
        <div className={styles.addMsgCon}>
          <div className={styles.dot} />
          <div className={styles.dotToLine} />
          <div className={styles.dotToLine2} />
          <div onClick={checkLeaveMsg} className={styles.addMsg}>
            留个言呗
          </div>
        </div>
        <div className={styles.messageListWrap}>
          <ul className={styles.mssageList}>
            {data.length &&
              data
                .slice(current - 1, MAX_PAGE_COUNT)
                .map((item, index) => (
                  <MsgItem
                    item={item}
                    index={index}
                    key={item._id + index}
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
              total={data.length}
              pageSize={MAX_PAGE_COUNT}
              onChange={page => handlePage(page, data)}
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
