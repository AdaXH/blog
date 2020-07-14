import React from 'react';

import { Form } from 'antd';

export default ({ initValue, code, getFieldDecorator }) => (
  <Form.Item style={{ display: 'none' }}>
    {getFieldDecorator(code, {
      initialValue: initValue,
    })(<span />)}
  </Form.Item>
);
