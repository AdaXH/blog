import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import Login from './components/login';
import Loading from '../../wrapComponent/Loading';
import Aside from './components/aside';
import Tips from './components/tips';
import User from './components/user';

@connect(
  ({ user, loading, dynamic, article, message, blogConfig: { config } }) => ({
    config,
    user,
    loading,
    dynamic,
    article,
    message,
  })
)
export class Index extends React.Component {
  state = {
    isLogin: false,
    showOperation: false,
    customer: 0,
  };

  interval = null;

  async componentDidMount() {
    const { dispatch, user } = this.props;
    clearInterval(this.interval);
    dispatch({ type: 'user/customer' }).then(number => {
      if (number && number !== 0) {
        this.interval = setInterval(() => {
          if (this.state.customer >= number) clearInterval(this.interval);
          this.setState(({ customer }) => ({
            customer: customer >= number ? number : customer + 10,
          }));
        });
      }
    });
    const preLoad = async () => {
      const { dynamic, article, message } = this.props;
      if (
        !dynamic.dynamic ||
        !dynamic.dynamic.length ||
        !article.data ||
        !article.data.length ||
        !message.data ||
        !message.data.length
      ) {
        try {
          Loading.show();
          await dynamicLoad();
          await articleLoad();
          await messagesLoad();
          Loading.hide();
        } catch (error) {
          Loading.hide();
        }
      }
    };
    const dynamicLoad = () =>
      new Promise(resolve =>
        dispatch({ type: 'dynamic/load', payload: { cb: resolve } })
      );
    const articleLoad = () =>
      new Promise(resolve =>
        dispatch({ type: 'article/load', payload: { cb: resolve } })
      );
    const messagesLoad = () =>
      new Promise(resolve =>
        dispatch({ type: 'message/load', payload: { cb: resolve } })
      );
    await preLoad();
    if (!user.isLogin && !!Cookies.get('user')) {
      dispatch({
        type: 'user/getUserInfo',
        payload: {},
      });
    }
  }

  componentWillUnmount = () => clearInterval(this.interval);

  handleOperation = item => {
    typeof item.url === 'string' ? window.open(item.url) : item.url();
  };

  handleCloseOperation({ nativeEvent: { target } }) {
    const { showOperation } = this.state;
    if (showOperation && !/target/.test(target.className))
      this.setState({ showOperation: false });
  }

  render() {
    const { user, config, dispatch } = this.props;
    const { customer } = this.state;
    const curraneYear = new Date().getFullYear();
    return (
      <div className={styles.indexContainer}>
        <Aside />
        <Tips config={{ ...config, customer }} />
        {!!Cookies.get('user') && user.isLogin ? (
          <User user={user} dispatch={dispatch} />
        ) : (
          <Login user={user} dispatch={dispatch} />
        )}
        <div className={styles.footerInfo}>
          React Blog © 2018 - {curraneYear} Adaxh
        </div>
      </div>
    );
  }
}
