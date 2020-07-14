import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';
import classNames from 'classnames';
import { LOGO, NAV } from '@/pages/common/constant';
import styles from './index.less';

export default props => {
  const { history } = props;
  const [menuVisible, setVisible] = useState(true);
  const navClass = classNames({
    [styles.visible]: menuVisible,
  });
  return (
    <nav className={navClass}>
      <div className={styles.menuIcon} onClick={() => setVisible(true)}>
        <Icon type="menu" />
      </div>
      <div className={styles.logo}>
        <img src={LOGO} alt="logo" />
      </div>
      {menuVisible && (
        <div className={styles.menuCon}>
          {NAV.map(({ title, icon, link }) => (
            <NavLink key={link} to={link}>
              <Icon type={icon} />
            </NavLink>
          ))}
          <div className={styles.close} onClick={() => setVisible(false)}>
            <Icon type="close" />
          </div>
        </div>
      )}
    </nav>
  );
};
