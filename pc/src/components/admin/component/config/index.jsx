import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useDidMount } from '@/utils/hooks';
import { getConfig, updateConfig } from '../../service';
import { ColorPicker } from './colorPicker';
import { configs } from './constant';
import styles from './index.less';

const { TextArea } = Input;

const Config = props => {
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
  } = props;
  const [config, setCfg] = useState({});
  useDidMount(async () => {
    const res = await getConfig();
    if (res.success) {
      setCfg(res.config);
    }
  });
  const onSave = async () => {
    const values = await validateFields();
    await updateConfig({ config: values });
  };

  const mapComponent = {
    input: props => <Input {...props} />,
    textArea: props => (
      <TextArea {...props} autosize={{ maxRows: 4, minRows: 4 }} />
    ),
    color: props => <ColorPicker {...props} />,
  };

  return (
    <div className={styles.configContainer}>
      {configs.map(({ label, code, type }) => (
        <Form.Item label={label}>
          {getFieldDecorator(code, {
            initialValue: config && config[code],
          })(
            mapComponent[type]({
              color: config && config[code],
              setFieldsValue,
              code,
            })
          )}
        </Form.Item>
      ))}
      <div className={styles.btn}>
        <Button onClick={onSave}>保存</Button>
      </div>
    </div>
  );
};

export default Form.create({})(Config);
