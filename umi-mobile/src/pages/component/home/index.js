import { useState } from 'react';
import classnames from 'classnames';
import { delay } from '@/util/functions';
import { NAVS, LOGO, TITLE, STATIC_IMG } from './constant';
import styles from './index.less';

export default () => {
  const [style, changeStyle] = useState(false);
  const handleClick = async callback => {
    if (callback) {
      changeStyle(true);
      await delay(0.6);
      callback();
      await delay(0.6);
      changeStyle(false);
    }
  };
  const classes = classnames({
    [styles.index]: true,
    [styles.hidden]: style,
    // [styles[props.theme]]: true,
  });
  return (
    <div className={classes}>
      <div className={styles.home}>
        <div className={styles.menus}>
          {NAVS.map(({ callback, icon }) => (
            <div key={icon} className={styles.menuItem} onClick={() => handleClick(callback)}>
              <svg className="icon" aria-hidden="true">
                <use href={`#${icon}`}></use>
              </svg>
            </div>
          ))}
        </div>
        <div className={styles.init}>
          {STATIC_IMG.map(item => (
            <div className={styles.initItem} key={item}>
              <svg className="icon" aria-hidden="true">
                <use href={item}></use>
              </svg>
            </div>
          ))}
        </div>
        <div className={styles.logo}>
          <img src={LOGO} alt="logo" />
        </div>
        <div className={styles.title}>{TITLE}</div>
      </div>
    </div>
  );
};
