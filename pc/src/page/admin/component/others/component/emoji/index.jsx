import React, { useState } from 'react';
import { getCache, setCache } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { EMOJI_CACHE_KEY } from '@/utils/constant';
import { getEmojis, updateEmoji } from './service';
import Modal from './component/modal';
import styles from './index.less';
import { useCallback } from 'react';

export default () => {
  const [list, setList] = useState(getCache(EMOJI_CACHE_KEY));
  const [modalInfo, setInfo] = useState({
    visible: false,
  });
  useDidMount(async () => {
    const { success, emojis } = await getEmojis();
    if (success) {
      setList(emojis);
      setCache(EMOJI_CACHE_KEY, emojis);
    }
  });
  const onAdd = () => {
    setInfo({
      visible: true,
    });
  };
  const onEdit = (src, code, _id) => {
    setInfo({
      visible: true,
      _id,
      code,
      src,
    });
  };
  const onDelete = async (src, _id, code) => {
    const fileType = src.split('.');
    const { success } = await updateEmoji({
      isDel: true,
      code,
      _id,
      fileType: fileType[fileType.length - 1],
    });
    if (success) {
      setList([...list.filter((item) => item._id !== _id)]);
    }
  };
  const onUpdate = useCallback((newSrc, code, _id) => {
    if (!_id) {
      // 新增
      setList([{ src: newSrc, code }, ...list]);
    } else {
      setList(
        list.map((item) => {
          if (_id === item._id) {
            item = {
              src: newSrc,
              code,
            };
            return item;
          }
        })
      );
    }
  }, []);
  return (
    <div className={styles.emojiContainer}>
      {modalInfo.visible && (
        <Modal
          {...modalInfo}
          onUpdate={onUpdate}
          onClose={() => setInfo({ visible: false })}
        />
      )}
      <div className={styles.item} onClick={onAdd}>
        +
      </div>
      {list.map(({ src, code, _id }) => (
        <div className={styles.itemWrap} key={_id || code}>
          <div className={styles.item} onClick={() => onEdit(src, code, _id)}>
            <img src={src} />
          </div>
          <div className={styles.info}>
            {code}
            <a onClick={() => onDelete(src, _id, code)}>[delete]</a>
          </div>
        </div>
      ))}
    </div>
  );
};
