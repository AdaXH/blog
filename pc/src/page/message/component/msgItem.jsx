import React from 'react';
import { useSetState } from 'react-use';
import Notification from '@/wrapComponent/Notification';
import RepeatItem from './repeatItem';
import { deleteMsgById } from '../service';
import { renderDate, getHtml } from '../util';
import styles from '../index.less';

export default (props) => {
  const {
    item,
    deleteMsgCallback,
    updateRepeat,
    user,
    index,
    callLeave,
    emojiList,
  } = props;
  const [state, setState] = useSetState({
    showOperation: false, // 展开操作
    showRepeat: false, // 展开回复列表
  });
  const { showOperation, showRepeat } = state;
  function noLogin() {
    if (!user.isLogin) {
      Notification.fail({ msg: '请先登录~' });
      return true;
    }
  }
  const deleteMsg = async (_id) => {
    if (noLogin()) return;
    const res = await deleteMsgById({ _id });
    if (res.success) {
      deleteMsgCallback(_id);
    }
  };
  console.log('emojiList', emojiList);
  return (
    <li
      className={styles.messageItem}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className={styles.msgAvatar}>
        <img src={item.avatar} alt="" />
      </div>
      <div className={styles.mssageName}>
        <div className={styles.leaveInfo}>
          <div>
            <span>{item.name}</span>
            <span className={styles.msgDate}>{renderDate(item.date)}</span>
          </div>
        </div>
      </div>
      <div className={styles.msgContent}>
        <span
          className={styles.conBox}
          dangerouslySetInnerHTML={{ __html: getHtml(item.content, emojiList) }}
        />
        <div className={styles.moreCon}>
          <div onClick={() => setState({ showRepeat: !showRepeat })}>
            <span className={styles.count}>{item.repeat.length}</span>
            <i
              className={`iconfont ${
                showRepeat ? 'icon-quxiao' : 'icon-zhankai'
              }`}
            />
          </div>
          <div onClick={() => setState({ showOperation: !showOperation })}>
            {showOperation ? 'Close' : 'More'}
          </div>
        </div>
        {showOperation && (
          <div className={styles.msgOperation}>
            <div onClick={() => callLeave(item._id, item.name, item.userId)}>
              <i className="iconfont icon-liuyan-A" />
            </div>
            <div onClick={() => deleteMsg(item._id)}>
              <i className="iconfont icon-shanchu" />
            </div>
          </div>
        )}
      </div>
      {showRepeat && item.repeat && (
        <RepeatItem
          list={item.repeat}
          parentId={item._id}
          leaveMsg={callLeave}
          updateRepeat={updateRepeat}
          emojiList={emojiList}
        />
      )}
    </li>
  );
};
