import React from 'react';
import { connect } from 'dva';
import { Base64 } from 'js-base64';
import Notification from '@/wrapComponent/Notification';
import { getDate, relativetime } from './util';
import styles from '../index.less';

const UI = (props) => {
  const {
    dynamic: { dynamicDetail },
    dispatch,
    user,
    top,
  } = props;
  const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || [];
  const checkUpvote = ({ _id }) => {
    return hasUpvote.includes(_id) ? 'alreadyUpvote' : 'none';
  };

  const upvote = ({ _id, upvote }) => {
    dispatch({
      type: 'dynamic/upvote',
      payload: {
        _id,
        isAdd: !hasUpvote.includes(_id),
      },
    });
  };
  const openDialog = (_id) => {
    if (!user || !user.isLogin) {
      Notification.fail({ msg: '登陆就能评论啦' });
      return;
    }
    const cb = (data) => {
      if (data === '' || (data.trim && data.trim() === '')) {
        Notification.fail({ msg: '输入不规范' });
        return;
      }
      dispatch({
        type: 'dynamic/leaveMsg',
        payload: {
          msg: {
            context: data,
            date: getDate(),
          },
          _id,
          name: Base64.encode(user.name),
        },
      }).then((current) => {
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

  const toggleOpen = (msg) => {
    if (!msg.length) return;
    dispatch({
      type: 'dynamic/toggleOpen',
    });
  };
  if (!dynamicDetail.visible) return null;
  const { content, img, msg = [], title } = dynamicDetail;
  return (
    <div className={styles.detailWrap}>
      <div className={styles.dynamicDetail} style={{ top: top }}>
        <div
          className={styles.dynamicDetailImg}
          style={{ backgroundImage: 'url(' + img + ')' }}
        />
        <div className={styles.dynamicDetailContent}>
          <div className={styles.momentTitle}>{title}</div>
          {content}
        </div>
        <div className={styles.dynamicOperation}>
          <div
            onClick={() => upvote(dynamicDetail)}
            className={`${styles.like} ${styles[checkUpvote(dynamicDetail)]}`}
          >
            <i className="icon-dianzan iconfont" />
            <span>{dynamicDetail.upvote}</span>
          </div>
          <div onClick={() => toggleOpen(msg)} className={styles.open}>
            <span>{msg.length}</span>
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
        {dynamicDetail.open && dynamicDetail.msg && (
          <div className={styles.dynamicMsg}>
            <ul className={styles.msgList}>
              {dynamicDetail.msg.reverse().map((item) => (
                <li key={item._id} className={styles.dynamicMsgItem}>
                  <div className={styles.dynamicName}>
                    {item.name || '神秘人'} 在 {relativetime(item.date)} 评论：
                  </div>
                  <div className={styles.dynamicMsgContent}>{item.context}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ dynamic, user }) => ({ dynamic, user }))(UI);
