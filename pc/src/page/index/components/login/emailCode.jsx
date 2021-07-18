import React, { useState, useEffect, useCallback } from 'react';
import { getEmailCode } from './service';
import { isEmail } from './util';
import styles from './index.less';

const Component = ({ email, onChange }) => {
  const [time, setTime] = useState(0);
  const [btnDisabled, setDisabled] = useState(false);
  useEffect(() => {
    if (time === 0) {
      clearInterval(Component.interVal);
      setDisabled(false);
    }
  }, [time]);
  const getCharCode = useCallback(async () => {
    const res = await getEmailCode({ email });
    if (res.success) {
      setDisabled(true);
      let start = 60;
      Component.interVal = setInterval(() => {
        setTime(start);
        start -= 1;
      }, 1000);
    }
  }, [email]);
  useEffect(() => {
    setDisabled(!isEmail(email));
  }, [email]);
  return (
    <div className={styles.emailCode}>
      <input onChange={onChange} />
      <a disabled={time || btnDisabled} onClick={getCharCode}>获取验证码{time || ''}</a>
    </div>
  );
};
export default Component;