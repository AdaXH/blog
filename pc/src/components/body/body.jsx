import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
const Body = ({ config }) => {
  const bgColor = (config && config.bgColor) || 'rgba(74, 74, 74, 0.64)';
  const bgImg = (config && config.bgImg) || 'rgba(74, 74, 74, 0.64)';
  const bgStyle = {
    background: `url(${bgImg}) no-repeat center 0`,
  };
  return (
    <span>
      <div className={styles.bg} style={bgStyle} />
      <div className={styles.bgOverlay} style={{ backgroundColor: bgColor }} />
    </span>
  );
};
export default connect(({ blogConfig: { config } }) => ({ config }))(Body);
