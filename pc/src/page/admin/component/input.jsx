import React from 'react';
import { Input } from 'antd';

export default ({ value, onChange }) => (
  <Input defaultValue={value} onPressEnter={(e) => onChange(e.target.value)} />
);
