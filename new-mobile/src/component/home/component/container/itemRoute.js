import React from 'react';
import styles from './index.less';

export default (props) => {
  const {
    menus,
    history: { push },
  } = props;
  return (
    <div className={styles.down}>
      {menus.map(
        ({ icon, desc, path, text, color, hidden, onClick }) =>
          !hidden && (
            <a
              className={styles.menuItem}
              key={icon}
              onClick={onClick ? onClick : () => push(path)}
            >
              <div className={styles.menuInfo}>
                <span>{text}</span>
                <span>{desc}</span>
              </div>
              <div className={styles.menuIcon}>
                <i style={{ color }} className={`iconfont ${icon}`} />
              </div>
            </a>
          ),
      )}
    </div>
  );
};
