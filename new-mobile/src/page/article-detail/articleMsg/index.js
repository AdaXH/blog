import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';
// import Cookies from 'js-cookie';
import { formatTime } from '@/util/module';
// import { useSetState }
import { useSetState } from 'react-use';
import ReplayModal from './replayModal';
import { discussArticle, deleteArticleMsg } from './service';
import styles from './index.less';
import MsgItem from './msgItem';

export default (props) => {
  const { data: propsData, articleId } = props;
  if (!propsData) return null;
  const [data, setData] = useState(propsData);
  const [quickReply, changeQuick] = useState(false);
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useSetState({
    visible: false,
    msgInfo: { articleId },
    onOk: (val) => void 0,
  });
  const handleSubmit = async () => {
    if (msg.trim() === '') return;
    const res = await discussArticle({ articleId, msg, quickReply });
    if (res.success) {
      setData(res.data.message);
      setMsg('');
    }
  };
  const deleteItem = async (messageId, userId) => {
    const res = await deleteArticleMsg({ articleId, messageId, userId });
    if (res.success) {
      setData(data.filter((item) => item._id !== messageId));
    }
  };
  const updateList = (messageId, innerId) => {
    setData(
      data.map((item) => {
        if (item._id === messageId) {
          item.repeat = item.repeat.filter((iItem) => iItem._id !== innerId);
        }
        return item;
      }),
    );
  };
  const { visible, msgInfo } = modal;
  const openModal = (messageId, toRepeatUserId, name) => {
    setModal({
      visible: true,
      msgInfo: { ...msgInfo, messageId, toRepeatUserId, name },
    });
  };
  return (
    <div className={styles.msgContainer}>
      <ReplayModal
        visible={visible}
        msgInfo={msgInfo}
        onCancel={() =>
          setModal({
            visible: false,
          })
        }
        setData={setData}
      />
      <h4 className={styles.title}>文章评论：</h4>
      <div className={styles.newMsgContainer}>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
        <div className={styles.replayFooter}>
          <Button
            disabled={msg.trim() === ''}
            className={styles.submit}
            type="danger"
            onClick={handleSubmit}
          >
            提交
          </Button>
          <span className={styles.quickMsg}>
            <Checkbox value={quickReply} onChange={(e) => changeQuick(e.target.checked)}>
              启用快捷评论（无需登录）
            </Checkbox>
          </span>
        </div>
      </div>{' '}
      <div className={styles.msgList}>
        <div>共{data.length}条评论</div>
        {data.map(({ _id, msg, date, avatar, repeat, name, userId, quickReply }) => (
          <div key={_id}>
            <div className={styles.msgItem}>
              <div className={styles.msgTop}>
                <span className={styles.avatar}>
                  <img src={avatar} alt="用户头像" />
                </span>
                <span className={styles.msgDate}>
                  {quickReply ? '陌生人' : name} - {formatTime(date)}：
                  {!quickReply && (
                    <React.Fragment>
                      <a onClick={() => openModal(_id, userId, name)}>[回复]</a>
                    </React.Fragment>
                  )}
                  <a className={styles.delete} onClick={() => deleteItem(_id, userId)}>
                    [删除]
                  </a>
                </span>
              </div>
              <div className={styles.msgText}>{msg}</div>
              <div className={styles.itemrepeat}>
                <MsgItem
                  updateList={updateList}
                  list={repeat}
                  messageId={_id}
                  openModal={setModal}
                  articleId={articleId}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
