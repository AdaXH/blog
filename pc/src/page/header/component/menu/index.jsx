import React, { useState } from 'react';
import { NavLink } from 'dva/router';
import styles from './index.less';

export default ({ routes, parent, admin }) => {
  if (!routes) return null;
  const onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(true);
  };
  const [visible, setVisible] = useState(false);
  return (
    <a
      className={styles.moreBox}
      href={parent.path}
      onClick={onClick}
      style={{ height: `${routes.length * 32}px ` }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {parent.title}
      {visible && (
        <div className={styles.con}>
          {routes.map(({ path, title, hidden, permission }) => {
            if (hidden || (permission && !admin)) return null;
            return (
              <NavLink to={path} url={path} className={styles.moreItem}>
                {title}
              </NavLink>
            );
          })}
        </div>
      )}
    </a>
  );
};
