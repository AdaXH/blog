import React from 'react';
import { Icon } from 'antd';
import start from './introduceConfig';
import s from './index.less';

export default class UI extends React.PureComponent {
  state = {
    html: () => void 0,
    text: '',
    show: false,
    timeout: null,
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    clearTimeout(this.state.timeout);
  }
  componentDidMount() {
    for (let i = 0; i < start.length; i++) {
      this.setState({
        timeout: setTimeout(() => {
          if (document.getElementsByClassName('Scrool')[0]) {
            document.getElementsByClassName('Scrool')[0].scrollIntoView(false);
          }
          if (i === 294) {
            this.setState({
              html: () => (
                <div ref="_ref" className={s._topView1}>
                  <p>姓名：向晗</p>
                </div>
              ),
            });
          }
          if (i === 336) {
            this.setState({
              html: () => (
                <div ref="_ref" className={s._topView2}>
                  <p>姓名：向晗</p>
                </div>
              ),
            });
          }
          if (i === 374) {
            this.setState({
              html: () => (
                <div ref="_ref" className={s._topView2 + ' ' + s._topView3}>
                  <p>姓名：向晗</p>
                </div>
              ),
            });
          }
          if (i === 409) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topView2 + ' ' + s._topView3 + ' ' + s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                </div>
              ),
            });
          }

          if (i === 446) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topView2 + ' ' + s._topView3 + ' ' + s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p className="">性别：男</p>
                </div>
              ),
            });
          }
          if (i === 500) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topView2 + ' ' + s._topView3 + ' ' + s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p className="">性别：男</p>
                  <p className={s.itemFromRight}>爱好：plmm</p>
                </div>
              ),
            });
          }
          //
          if (i === 522) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topView2 + ' ' + s._topView3 + ' ' + s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p className="">性别：男</p>
                  <p
                    style={{ textDecoration: 'line-through' }}
                    className={s.itemFromRight}
                  >
                    爱好：plmm
                  </p>
                </div>
              ),
            });
          }
          if (i === 558) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topView2 + ' ' + s._topView3 + ' ' + s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p>性别：男</p>
                  <p
                    className={s.itemFromRight}
                    style={{ textDecoration: 'line-through' }}
                  >
                    爱好：plmm
                  </p>
                  <p className={s.itemFromRight}>爱好：code</p>
                </div>
              ),
            });
          }
          if (i === 593) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topViewRotate +
                    ' ' +
                    s._topView2 +
                    ' ' +
                    s._topView3 +
                    ' ' +
                    s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p>性别：男</p>
                  <p
                    className={s.itemFromRight}
                    style={{ textDecoration: 'line-through' }}
                  >
                    爱好：plmm
                  </p>
                  <p className={s.itemFromRight}>爱好：code</p>
                </div>
              ),
            });
          }
          if (i === 628) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topViewRotate +
                    ' ' +
                    s._topView2 +
                    ' ' +
                    s._topView3 +
                    ' ' +
                    s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p>性别：男</p>
                  <p
                    className={s.itemFromRight}
                    style={{ textDecoration: 'line-through' }}
                  >
                    爱好：plmm
                  </p>
                  <p className={s.itemFromRight}>爱好：code</p>
                  <p className={s.itemFromRight}>年龄：24</p>
                </div>
              ),
            });
          }
          if (i === 680) {
            this.setState({
              html: () => (
                <div
                  ref="_ref"
                  className={
                    s._topViewRotate +
                    ' ' +
                    s._topView2 +
                    ' ' +
                    s._topView3 +
                    ' ' +
                    s._topView4
                  }
                >
                  <p>姓名：向晗</p>
                  <p>性别：男</p>
                  <p
                    className={s.itemFromRight}
                    style={{ textDecoration: 'line-through' }}
                  >
                    爱好：plmm
                  </p>
                  <p className={s.itemFromRight}>爱好：code</p>
                  <p className={s.itemFromRight}>年龄：24</p>
                  <p className={s.itemFromRight}>
                    技能：HTML，CSS3，ES6-7-8，Node，React...
                  </p>
                </div>
              ),
            });
          }

          if (i === 815) {
            this.setState({ show: true });
          }
          this.setState({
            text: this.state.text + start[i],
          });
        }, i * 50),
      });
    }
  }
  toggleStatus() {
    if (this.refs._ref) {
      const el = document.querySelector('.' + s._topView2);
      if (el) {
        /toggleStatus/.test(el.className)
          ? (el.className = el.className.replace(/toggleStatus/, ' '))
          : (el.className += ' ' + s.toggleStatus);
      }
    }
  }
  render() {
    const { html, show } = this.state;
    return (
      <div className={s.aboutContainer}>
        <div ref="ref" className={s.contentSlideFromLeft + ' ' + s.diyView}>
          {html()}
          {show && (
            <Icon
              onClick={() => this.toggleStatus()}
              className={s.togleStatus}
              type="redo"
            />
          )}
        </div>
        <div className={s.inputText + ' ' + s.contentSlideFromRight}>
          <div className={s.Scrool}>{this.state.text}</div>
        </div>
      </div>
    );
  }
}
