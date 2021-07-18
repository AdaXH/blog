import React, { useState, useCallback, useEffect } from 'react';
import { Input } from 'antd';
import EmptyForm from '../../emptyForm';
import { getCode } from '../../service';
import styles from '../../index.less';
const Component = (props) => {
  const {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    emailVal,
    user: { email },
  } = props;
  const [time, setTime] = useState(0);
  const [bindEmailCode, setBindEmail] = useState('');
  useEffect(() => {
    setFieldsValue({ bindEmailCode });
  }, [bindEmailCode]);
  const [btnDisabled, setDisabled] = useState(false);
  const disabled = emailVal === email || !emailVal;
  useEffect(() => {
    async function check() {
      try {
        setDisabled(false);
        await validateFields(['email']);
      } catch (error) {
        setDisabled(true);
      }
    }
    if (emailVal) {
      check();
    }
  }, [emailVal]);
  const getCharCode = useCallback(async () => {
    const res = await getCode({ email: emailVal });
    if (res.success) {
      setDisabled(true);
      let start = 60;
      Component.interVal = setInterval(() => {
        setTime(start);
        start -= 1;
      }, 1000);
    }
  }, [emailVal]);
  useEffect(() => {
    if (time === 0) {
      clearInterval(Component.interVal);
      setDisabled(false);
    }
  }, [time]);
  return (
    <div className={styles.charCode}>
      <EmptyForm
        getFieldDecorator={getFieldDecorator}
        code="bindEmailCode"
        initValue={''}
      />
      <span className={styles.label}>邮箱验证码：</span>
      <div className={styles.charCodeCon}>
        <Input
          disabled={disabled}
          placeholder="请输入您收到的验证码"
          value={bindEmailCode}
          onChange={(e) => setBindEmail(e.target.value)}
        />
        <a onClick={getCharCode} disabled={time || btnDisabled || disabled}>
          获取验证码{time || ''}
        </a>
      </div>
    </div>
  );
};

export default Component;
