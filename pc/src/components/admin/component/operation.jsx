import React from 'react';
import { Radio } from 'antd';

export default (props) => {
  const { value, onChange } = props;
  return (
    <Radio.Group value={value} onChange={onChange}>
      <Radio value={true}>通过</Radio>
      <Radio value={false}>未通过</Radio>
    </Radio.Group>
  );
};
