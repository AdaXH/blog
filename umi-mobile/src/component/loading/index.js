import ReactDOM from 'react-dom';
import styles from './index.less';

const mountComponent = component => {
  const parent = document.getElementById('__wrapComponent__');
  if (!parent) {
    const __wrapComponent__ = document.createElement('div');
    __wrapComponent__.id = '__wrapComponent__';
    document.getElementsByTagName('body')[0].appendChild(__wrapComponent__);
  }
  ReactDOM.render(component(), document.getElementById('__wrapComponent__'));
};

const showLoading = (props, destory) => {
  const component = props => {
    return (
      <div>
        {destory ? (
          ''
        ) : (
          <div className={styles.loadingUI}>
            <div className={styles.loadingContainer}>
              <div className={styles['k-ball7a']}></div>
              <div className={styles['k-ball7b']}></div>
              <div className={styles['k-ball7c']}></div>
              <div className={styles['k-ball7d']}></div>
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
