import React, { useState } from 'react';
import Notification from '@/wrapComponent/Notification';
import { deleteInnerRepeat } from '../service';
import { relativetime } from './util';
import styles from '../index.less';

export default props => {
  const { list, ...others } = props;
  if (!list.length) return <div className={styles.repeatList}>empty ~ </div>;
  return (
    <ul className={styles.repeatList}>
      {list.map(item => {
        return <Item item={item} key={item._id} {...others} />;
      })}
    </ul>
  );
};

const Item = props => {
  const { item, parentId, leaveMsg, updateRepeat } = props;
  const [showOperation, setState] = useState(false);
  const deleteMsg = async _id => {
    const result = await deleteInnerRepeat({
      _id,
      _parent_id: parentId,
    });
    if (result.success) {
      updateRepeat(parentId, result.data);
    } else {
      Notification.fail({ msg: result.errorMsg });
    }
  };
  return (
    <li key={item._id} className={styles.repeatItem}>
      <div className={styles.repeatInfo}>
        {item.name} {relativetime(item.date)} @ {item.toRepeat}
      </div>
      <div className={styles.repeatContent}>
        {item.info}
        <div onClick={() => setState(!showOperation)} className={styles.more}>
          {showOperation ? 'Close' : 'More'}
        </div>
      </div>
      {showOperation && (
        <div className={styles.msgOperation}>
          <div onClick={() => leaveMsg(parentId, item.name)}>
            <i className="iconfont icon-liuyan-A" />
          </div>
          <div onClick={() => deleteMsg(item._id)}>
            <i className="iconfont icon-shanchu" />
          </div>
        </div>
      )}
    </li>
  );
};
