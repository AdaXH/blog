import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { ColorPicker } from './colorPicker';
import styles from './index.less';

export default (props) => {
  const { setFieldsValue, code } = props;
  const [value, setValue] = useState(props.value || [{ img: '', color: '' }]);
  useEffect(() => {
    if (props.value) setValue([...props.value]);
  }, [props.value]);
  const onAdd = () => {
    setValue([...value, {}]);
  };
  const onDelete = (index) => {
    const newVal = value.filter((_, idx) => index !== idx);
    setValue(newVal);
    setFieldsValue({ [code]: newVal });
  };
  const onChange = (val, idx, key) => {
    const newVal = value.map((item, index) => {
      if (index === idx) {
        return {
          ...item,
          [key]: val,
        };
      }
      return item;
    });
    setValue(newVal);
    setFieldsValue({ [code]: newVal });
  };
  return value.map((item, index) => (
    <div className={styles.list} key={item._id}>
      <Input
        value={item.img}
        onChange={(e) => onChange(e.target.value, index, 'img')}
      />
      <div className={styles.color}>
        <ColorPicker
          getColor={(color) => onChange(color, index, 'color')}
          color={item.color}
        />
      </div>
      <div className={styles.operation}>
        {index === 0 && <a onClick={onAdd}>add</a>}
        {index !== 0 && <a onClick={() => onDelete(index)}>del</a>}
      </div>
    </div>
  ));
};
