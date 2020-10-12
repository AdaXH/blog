import React, { useRef, useState, useEffect } from 'react';
import { useUnmount } from '@/utils/hooks';
import { randomLeft } from './util';
import { randomKeyword } from '../../util';
import { getComment } from '../../service';
import styles from './index.less';

const Item = ({ data, index, length, keywords }) => {
  const ref = useRef({});
  const [comment, setData] = useState(data);
  const { content, name, songName, commentId } = comment;
  const interId = useRef();
  async function queryMoment(lastId, callback) {
    const { comment } =
      (await getComment({
        keyword: randomKeyword(keywords),
      })) || {};
    if (comment && comment.content) {
      setData(comment);
      startInter(randomLeft());
    }
  }
  function startInter(left) {
    const speed = Math.random();
    try {
      const el = ref.current;
      if (!el) return;
      let lastYVal = 1;
      let lastLeft = left;
      const { clientHeight: height } = el;
      try {
        lastYVal = parseInt(
          el.style.transform.split(',')[1].replace('px', ''),
          10
        );
        lastLeft = el.style.transform
          .split(',')[0]
          .replace(/translate3d\(+|px/g, '');
      } catch (error) {
        // ingore
      }
      let y = lastYVal;
      requestAnimationFrame(async function change() {
        const wHeight = window.innerHeight;
        y -= speed > 0.5 ? 0.5 : speed;
        if (speed <= 0.3) {
          y -= 0.2;
        }
        el.style.transform = `translate3d(${left || lastLeft}px, ${y}px, 0)`;
        if (~y - height >= wHeight) {
          cancelAnimationFrame(interId.current);
          y = height;
          el.style.transform = `translate3d(${left || lastLeft}px, ${
            height + 50
          }px, 0)`;
          await queryMoment();
        }
        interId.current = requestAnimationFrame(change);
      });
    } catch (error) {
      console.log('error', error);
    }
  }
  useEffect(() => {
    if (ref.current) {
      const left = randomLeft();
      startInter(left);
    }
  }, [ref]);
  const onMouseEnter = () => {
    cancelAnimationFrame(interId.current);
    ref.current.style.zIndex = 100;
  };
  const onMouseLeave = () => {
    startInter();
    ref.current.style.zIndex = 1;
  };
  useUnmount(() => cancelAnimationFrame(interId.current));
  if (!comment) return null;
  return (
    <div
      ref={ref}
      className={styles.flyItem}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={index}
      style={{ zIndex: length - index, left: `${index * 50}px` }}
    >
      <div className={styles.content} key={commentId}>
        {content}
      </div>
      {content && (
        <div className={styles.footer}>
          <span>
            来自 - {name} - 网易云热评 ‘{songName}’
          </span>
        </div>
      )}
    </div>
  );
};

export default Item;
