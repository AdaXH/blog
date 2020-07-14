import React from 'react';
import styles from '../style';
import { mountComponent } from '../mountComponent';

const Notification = {};

const setInstance = () => {
  ['success', 'fail'].forEach(_type_ => {
    const key = _type_;
    Notification[_type_] = args => Component(args, key);
  });
};

setInstance();

const Component = (props, _type_) => {
  // if (window.live2dMsg) {
  //     window.live2dMsg(props.msg || '')
  // } else {

  class __Component__ extends React.PureComponent {
    state = {
      show: true,
      visible: true,
      timer: undefined,
    };

    componentDidMount() {
      clearTimeout(this.state.timer);
      const { duration } = { duration: 3.5, ...props };
      this.setState({
        timer: setTimeout(
          () =>
            this.setState({ show: false }, () =>
              setTimeout(() => this.setState({ visible: false }), 1000)
            ),
          Number(duration) * 1000
        ),
      });
    }

    componentWillUnmount() {
      this.setState = () => {
        return;
      };
      clearTimeout(this.state.timer);
    }

    render() {
      const extendsProps = {
        msg: 'notification !!!',
        ...props,
      };
      const { show, visible } = this.state;
      const { msg } = extendsProps;
      return (
        <div>
          {visible && (
            <div className={styles.toastContainer}>
              <div
                className={styles.toast}
                style={{
                  transform: `${
                    show ? 'translate3d(100px, 0, 0)' : 'translate3d(0,0,0)'
                  }`,
                  animationName: `${show ? styles.show : styles.hide}`,
                }}
              >
                <i
                  style={{
                    color: _type_ === 'success' ? '#52c41a' : '#f5222d',
                  }}
                  className={
                    styles.status +
                    ' icon-' +
                    (_type_ === 'success' ? 'queding' : 'wenti') +
                    ' iconfont'
                  }
                />
                <span>{msg}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
  mountComponent(() => <__Component__ />, '__notification__con');
  // }
};

export default Notification;
