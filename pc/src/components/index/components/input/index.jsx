import React, { useState } from 'react';
import styles from './index.less';
export default props => {
  const {
    initValue,
    type = 'text',
    label,
    getValue = () => {},
    onEnter = () => {},
  } = props;
  const [laStyle, setStyle] = useState(false);
  const [value, setValue] = useState(initValue || '');
  const labelClassName = styles[laStyle ? 'focus' : 'blur'];
  const onChange = e => {
    const {
      nativeEvent: { keyCode },
      target: { value: val },
    } = e;
    setValue(val.trim());
    getValue(val.trim());
    if (keyCode === 13) onEnter();
  };
  const TYLE_VALUE = type === 'password' ? 5.5 : 7;
  const xVa = value.length * TYLE_VALUE;
  const style = {
    transform: `translate3d(${xVa}px ,0,0)`,
    opacity: laStyle ? '1' : '0',
  };
  const onBlur = () => setStyle(value && value.trim() !== '');
  return (
    <div className={styles.iInput}>
      <span className={labelClassName}>{label}</span>
      <input
        type={type}
        onFocus={() => setStyle(true)}
        onBlur={() => onBlur()}
        onKeyDown={e => onChange(e)}
        onChange={e => onChange(e)}
        value={value}
      />
      <div style={style} className={styles.effectLine} />
    </div>
  );
};
