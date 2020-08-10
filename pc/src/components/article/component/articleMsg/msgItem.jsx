import React from 'react';
import { formatTime } from '@/utils/functions';
import { deleteArticleReplyMsg } from './service';
import styles from './index.less';
export default ({ list, messageId, articleId, updateList, openModal }) => {
  const deleteItem = async (repeatId, userId) => {
    const res = await deleteArticleReplyMsg({
      repeatId,
      userId,
      messageId,
      articleId,
    });
    if (res.success) {
      updateList(messageId, repeatId);
    }
  };
  const onReplay = (messageId, toRepeatUserId, name) => {
    openModal({
      visible: true,
      msgInfo: {
        articleId,
        messageId,
        toRepeatUserId,
        name,
      },
    });
  };
  return (
    <div className={`${styles.msgList} ${styles.msgRepeatList}`}>
      {list.map(
        ({ _id, msg, date, avatar, name, userId, toRepeatUserVo = {} }) => (
          <div key={_id}>
            <div className={styles.msgItem}>
              <div className={styles.msgTop}>
                <span className={styles.avatar}>
                  <img src={avatar} alt="用户头像" />
                </span>
                <span className={styles.msgDate}>
                  {name} -{formatTime(date)}
                  {name === toRepeatUserVo.name
                    ? null
                    : `@ ${toRepeatUserVo.name}`}
                  ：
                  <a
                    onClick={() =>
                      onReplay(messageId, userId, toRepeatUserVo.name)
                    }
                  >
                    [回复]
                  </a>
                  <a
                    className={styles.delete}
                    onClick={() => deleteItem(_id, userId)}
                  >
                    [删除]
                  </a>
                </span>
              </div>
              <div className={styles.msgText}>{msg}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
