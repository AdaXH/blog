import React from 'react';
import { connect } from 'dva';
import { Base64 } from 'js-base64';
import Notification from '../../wrapComponent/Notification';
import styles from './dynamic.less';

const UI = props => {
  const {
    dynamic: { dynamicDetail },
    dispatch,
    user,
    top,
  } = props;

  const checkUpvote = ({ _id }) => {
    const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || [];
    return hasUpvote.includes(_id) ? 'alreadyUpvote' : 'none';
  };

  const upvote = ({ _id, upvote }) => {
    const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || [];
    dispatch({
      type: 'dynamic/upvote',
      payload: {
        _id,
        isAdd: !hasUpvote.includes(_id),
      },
    });
  };

  const openDialog = _id => {
    if (!user || !user.isLogin) {
      Notification.fail({ msg: '登陆就能评论啦' });
      return;
    }
    const cb = data => {
      if (data === '' || (data.trim && data.trim() === '')) {
        Notification.fail({ msg: '输入不规范' });
        return;
      }
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hour = d.getHours();
      const minute = d.getMinutes();
      const currentDay =
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        '--' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute);

      dispatch({
        type: 'dynamic/leaveMsg',
        payload: {
          msg: {
            context: data,
            date: currentDay,
          },
          _id,
          name: Base64.encode(user.name),
        },
      }).then(current => {
        dispatch({ type: 'dialog/hide' });
        Notification[current ? 'success' : 'fail']({
          msg: current ? '操作成功' : '操作失败',
        });
      });
    };
    dispatch({
      type: 'dialog/open',
      payload: { cb, placeholder: '在这里写下你的评论', maxInput: 60 },
    });
  };

  const toggleOpen = () => {
    dispatch({
      type: 'dynamic/toggleOpen',
    });
  };

  return dynamicDetail.visible && dynamicDetail && dynamicDetail.msg ? (
    <div className={styles.detailWrap}>
      <div className={styles.dynamicDetail} style={{ top: top }}>
        <div
          className={styles.dynamicDetailImg}
          style={{ backgroundImage: 'url(' + dynamicDetail.img + ')' }}
        />
        <div className={styles.dynamicDetailContent}>
          {dynamicDetail.content}
        </div>
        <div className={styles.dynamicOperation}>
          <div
            onClick={() => upvote(dynamicDetail)}
            className={`${styles.like} ${styles[checkUpvote(dynamicDetail)]}`}
          >
            <i className="icon-dianzan iconfont" />
            <span>{dynamicDetail.upvote}</span>
          </div>
          <div onClick={() => toggleOpen()} className={styles.open}>
            <span>{dynamicDetail.msg.length}</span>
            <i
              className={
                (dynamicDetail.open ? 'icon-quxiao' : 'icon-zhankai') +
                ' iconfont'
              }
            />
          </div>
          <div
            onClick={() => openDialog(dynamicDetail._id)}
            className={styles.repeat}
          >
            <i className="iconfont icon-liuyan-A" />
          </div>
        </div>
        {dynamicDetail.open &&
          dynamicDetail.msg &&
          dynamicDetail.msg.length !== 0 && (
            <div className={styles.dynamicMsg}>
              <ul className={styles.msgList}>
                {dynamicDetail.msg.reverse().map(item => (
                  <li key={item._id} className={styles.dynamicMsgItem}>
                    <div className={styles.dynamicName}>
                      {item.name || '神秘人'} 在 {item.date} 评论：
                    </div>
                    <div className={styles.dynamicMsgContent}>
                      {item.context}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  ) : (
    ''
  );
};

export default connect(({ dynamic, user }) => ({ dynamic, user }))(UI);
