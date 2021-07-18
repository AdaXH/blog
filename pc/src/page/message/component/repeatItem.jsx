import React, { useState } from 'react';
import Notification from '@/wrapComponent/Notification';
import { deleteInnerRepeat } from '../service';
import { relativetime } from './util';
import { getHtml } from '../util';
import styles from '../index.less';
// import others from '../../admin/component/others';

export default (props) => {
  const { list, ...others } = props;
  if (!list.length)
    return (
      <div className={styles.repeatList}>
        <span className={styles.repeatItem}>empty ~ </span>
      </div>
    );
  return (
    <ul className={styles.repeatList}>
      {list.map((item, index) => {
        return <Item index={index} item={item} key={item._id} {...others} />;
      })}
    </ul>
  );
};

const Item = (props) => {
  const { item, parentId, leaveMsg, updateRepeat, index, emojiList } = props;
  const [showOperation, setState] = useState(false);
  const deleteMsg = async ({ _id, userId }) => {
    const result = await deleteInnerRepeat({
      _id,
      _parent_id: parentId,
      toRepeatUserId: userId,
    });
    if (result.success) {
      updateRepeat(parentId, result.data);
    } else {
      Notification.fail({ msg: result.errorMsg });
    }
  };
  const toRepeat = item.toRepeatUser ? item.toRepeatUser.name : item.toRepeat;
  const style = {
    animationDelay: `${index * 0.15}s`,
  };
  return (
    <li key={item._id} className={styles.repeatItem} style={style}>
      <div className={styles.repeatInfo}>
        <img src={item.avatar} alt="" />
        <div className={styles.nameInfo}>
          <span>
            {item.name} @ {toRepeat}
          </span>
          <span>{relativetime(item.date)}</span>
        </div>
      </div>
      <div className={styles.repeatContent}>
        <span
          className={styles.conBox}
          dangerouslySetInnerHTML={{
            __html: getHtml(item.info, emojiList),
          }}
        />
        <div onClick={() => setState(!showOperation)} className={styles.more}>
          {showOperation ? 'Close' : 'More'}
        </div>
      </div>
      {showOperation && (
        <div className={styles.msgOperation}>
          <div onClick={() => leaveMsg(parentId, item.name, item.userId)}>
            <i className="iconfont icon-liuyan-A" />
          </div>
          <div onClick={() => deleteMsg(item)}>
            <i className="iconfont icon-shanchu" />
          </div>
        </div>
      )}
    </li>
  );
};
