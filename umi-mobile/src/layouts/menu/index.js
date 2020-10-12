import React, { useState } from 'react';
import Texty from 'rc-texty';
import { MENUS } from './constant';
import styles from './index.less';
import 'rc-texty/assets/index.css';

export default ({ user, dispatch }) => {
  const [visible, setVisible] = useState(false);
  const style = {
    zIndex: visible ? 112 : -1,
    background: `rgba(0,0,0,${visible ? 0.2 : 0})`,
  };
  const onOpen = (e) => {
    e.stopPropagation();
    setVisible(true);
  };
  const onTurn2 = (e, callback) => {
    e.stopPropagation();
    callback && callback();
  };
  return (
    <>
      <div className={styles.menu} onClick={() => setVisible(false)} style={style}>
        {visible && (
          <div className={styles.menuWraper}>
            {MENUS.map(({ title, icon, onClick }, index) => (
              <div key={title} className={styles.menuItem} onClick={(e) => onTurn2(e, () => onClick(user, dispatch))}>
                <i style={{ animationDelay: `${index / 2}s` }} className={`iconfont ${icon}`} />
                <Texty delay={index * 300}>{typeof title === 'string' ? title : title(user)}</Texty>
              </div>
            ))}
          </div>
        )}
      </div>
      {!visible && (
        <div onClick={onOpen} className={styles.menuEntry}>
          <i className="iconfont icon-menu" />
        </div>
      )}
    </>
  );
};
