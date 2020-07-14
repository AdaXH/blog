import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import styles from './index.less';
import { ColorPicker } from './colorPicker';
import { configs } from './constant';

const { TextArea } = Input;

const Config = props => {
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    dispatch,
    config,
  } = props;
  const onSave = () => {
    validateFields((err, value) => {
      dispatch({
        type: 'blogConfig/updateConfig',
        config: { ...value },
      });
    });
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

export default connect(({ blogConfig: { config } }) => ({ config }))(
  Form.create({})(Config)
);
