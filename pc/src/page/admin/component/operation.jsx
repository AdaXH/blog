import React from 'react';
import { Radio } from 'antd';

export default props => {
  const { value, onChange, onDelete } = props;
  return (
    <React.Fragment>
      <Radio.Group value={value} onChange={onChange}>
        <Radio value={true}>通过</Radio>
        <Radio value={false}>未通过</Radio>
      </Radio.Group>
      <a onClick={onDelete}>删除</a>
    </React.Fragment>
  );
};
