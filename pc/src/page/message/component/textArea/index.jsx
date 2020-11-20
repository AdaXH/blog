import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import Notification from '@/wrapComponent/Notification';
import Preview from './component/preview';
import Emoji from './component/emoji';
import { escapeData } from '../../util';
import { EMOJI_PREFIX } from './component/emoji/constant';
import { leaveMessage, repeatMsg } from '../../service';

import styles from './index.less';

export default forwardRef((props, ref) => {
  const [data, setData] = useState();
  const {
    info: { type, _id, toRepeat, cb, toRepeatId, visible },
    quickReply,
    setInfo,
    emojiList,
  } = props;
  if (!visible) return null;
  const [preview, setVisible] = useState(true);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const ref1 = useRef();
  useImperativeHandle(ref, () => ({ getData: () => data }));
  const onSubmit = async () => {
    const value = data;
    if (!value || value.trim() === '') {
      Notification.fail({
        msg: '输入不规范',
      });
    } else {
      if (value.length && value.length > 300) {
        Notification.fail({
          msg: '内容过长',
        });
        return;
      }
      if (type === 'leaveMsg') {
        const msg = escapeData(value);
        const result = await leaveMessage({
          date: Date.now(),
          content: msg,
          quickReply: _id || quickReply,
        });
        if (result.success) {
          await cb();
          setInfo({ visible: false });
        } else {
          Notification.fail({
            msg: result.errorMsg || result || '留言失败',
          });
        }
      } else if (type === 'repeat') {
        if (toRepeatId === 'null') {
          Notification.fail({ msg: '不能回复快捷评论~' });
          return;
        }
        const result = await repeatMsg({
          _id,
          info: escapeData(value),
          toRepeat,
          toRepeatId,
        });
        if (result.success) {
          const {
            data: { repeat },
          } = result;
          cb(_id, repeat);
          setInfo({ visible: false });
        } else {
          Notification.fail({ msg: result.errorMsg });
        }
      }
    }
  };
  const onAdd = (code) => {
    setData(`${data || ''}${EMOJI_PREFIX}${code}${EMOJI_PREFIX}`);
  };
  return (
    <dic className={styles.dialogBox}>
      <div
        className={styles.bgWrap}
        onClick={() => setInfo({ visible: false })}
      />
      <div className={styles.container}>
        <div className={styles.content}>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            ref={ref1}
            autoFocus
            placeholder="支持markdown语法"
          />
          <div className={styles.footer}>
            <a className={styles.item} onClick={() => setVisible(!preview)}>
              <i className="iconfont icon-preview" />
            </a>
            <a
              className={styles.item}
              onClick={() => setEmojiVisible(!emojiVisible)}
            >
              <i className="iconfont icon-emoji" />
            </a>
            <a className={styles.item} onClick={onSubmit}>
              <i className="iconfont icon-submit" />
            </a>
          </div>
          {emojiVisible && <Emoji onAdd={onAdd} emojiList={emojiList} />}
          {preview && <Preview emojiList={emojiList} value={data} />}
        </div>
      </div>
    </dic>
  );
});
