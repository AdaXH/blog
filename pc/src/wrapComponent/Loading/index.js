import React from 'react';
import styles from '../style';
import { mountComponent } from '../mountComponent';

const showLoading = (props, destory) => {
  !destory ? props.startCb && props.startCb() : props.endCb && props.endCb();
  const component = props => {
    const extendsProps = props || {};
    const content = extendsProps.content || 'LOADING';
    return (
      <div>
        {destory ? (
          ''
        ) : (
          <div className={styles.loadingContainer}>
            <div
              className={styles.loadingMask}
              style={{
                background: extendsProps.background || 'rgba(74, 74, 74, 0.25)',
              }}
            />
            <div className={styles.loadingWrap}>
              <div
                className={`${styles.loadingDot + ' ' + styles.startLoading}`}
              />
              <div
                style={{ color: extendsProps.color || 'white' }}
                className={styles.loadingText}
              >
                {content}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  mountComponent(() => component(props));
};

const Loading = {
  show: (args = {}) => showLoading(args, false),
  hide: (args = {}) => {
    showLoading(args, true);
  },
};

export default Loading;
