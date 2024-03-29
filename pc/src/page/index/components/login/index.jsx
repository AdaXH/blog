import React, { useState, useEffect, useRef } from 'react';
import { Base64 } from 'js-base64';
import { useSetState } from 'react-use';
import ReactHtmlParser from 'react-html-parser';
import Api from '@/utils/request';
import Notification from '@/wrapComponent/Notification';
import { useDidMount } from '@/utils/hooks';
import { resetObj, qqSign } from '@/utils/functions';
import { setContent, checkValue } from './util';
import FindPwd from './forgetPwd';
import EmailCode from './emailCode';
import styles from './index.less';
export default (props) => {
  const { dispatch } = props;
  const [isLogin, changeSatus] = useState(false);
  const [svg, setSvg] = useState('');
  const [values, setState] = useSetState({
    name: '',
    email: '',
    captcha: '',
    repeatPassword: '',
    pwd: '',
    emailCode: '',
  });
  const { captcha } = values;
  const onSetValue = (val, code) => {
    setState({ [code]: val });
  };
  const ref = useRef({});
  useEffect(() => {
    setState(resetObj(values));
  }, [isLogin]);
  const getCaptcha = () =>
    Api('api/getCaptcha', 'POST', {}, true).then((svg) => setSvg(svg));
  useDidMount(() => {
    getCaptcha();
  });
  useEffect(() => {
    if (window.QC && ref.current) {
      window.QC.Login({
        btnId: 'qqLoginBtn', //插入按钮的节点id
      });
    }
  }, [window.QC]);
  const content = setContent(isLogin, values);
  const handleSubmit = () => {
    const { name, pwd, captcha: captchaCode, email, emailCode } = values;
    const hasError = checkValue(isLogin ? 'login' : 'register', values);
    if (hasError) {
      Notification.fail({ msg: hasError });
      return;
    }
    if (isLogin) {
      dispatch({
        type: 'user/login',
        payload: {
          pwd: Base64.encode(pwd),
          name,
          state: true,
        },
      }).then((result) => {
        result.success && changeSatus(true);
        Notification[result.success ? 'success' : 'fail']({
          msg: result.success ? '登陆成功！' : result.errorMsg || result,
        });
      });
    } else {
      dispatch({
        type: 'user/register',
        payload: {
          name,
          pwd: Base64.encode(pwd),
          captchaCode,
          email,
          emailCode,
        },
      }).then((result) => {
        if (result.success) {
          Notification.success({ msg: '注册成功', duration: 3 });
          changeSatus(true);
        }
      });
    }
  };

  const handelKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };
  return (
    <div className={styles.rightContainer}>
      <div className={styles.top}>
        <div
          onClick={() => changeSatus(false)}
          className={`${styles.selectSignUp} ${!isLogin && styles.current}`}
        >
          注册
        </div>
        <div
          onClick={() => changeSatus(true)}
          className={`${styles.selectLogin} ${isLogin && styles.current}`}
        >
          登录
        </div>
      </div>
      <div
        className={styles.down}
        style={{ height: isLogin ? '250px' : '520px' }}
      >
        {content.map(({ code, value, type, text, email }) => (
          <div key={code} className={styles.inputItem}>
            <span>{text}</span>
            {code !== 'captcha' ? (
              code === 'emailCode' ? (
                <EmailCode
                  onKeyDown={handelKeyDown}
                  onChange={(e) => onSetValue(e.target.value, code)}
                  email={email}
                />
              ) : (
                <input
                  autoComplete="new-password"
                  value={value}
                  type={type}
                  onChange={(e) => onSetValue(e.target.value, code)}
                  onKeyDown={handelKeyDown}
                />
              )
            ) : (
              <div className={styles.inputItem}>
                <input
                  autoComplete="new-password"
                  onChange={(e) => onSetValue(e.target.value, code)}
                  value={captcha}
                  type="text"
                  onKeyDown={handelKeyDown}
                />
                <div onClick={() => getCaptcha()} className={styles.captcha}>
                  {ReactHtmlParser(svg)}
                </div>
              </div>
            )}
          </div>
        ))}
        <div className={styles.inputItem}>
          <div onClick={handleSubmit} className={styles.btn}>
            {isLogin ? '登录' : '点击注册'}
          </div>
          <div onClick={qqSign} className={styles.qqSign}>
            QQ 登录
          </div>
          <a onClick={(e) => e.stopPropagation()}>
            <FindPwd />
          </a>
          <span className={styles.qqLogo} id="qqLoginBtn"></span>
        </div>
      </div>
    </div>
  );
};
