import React, { useState } from 'react';
import { Select, Popconfirm } from 'antd';
import { deleteUser, changeUserStatus } from './service';
import styles from './index.less';

export default ({ user, delCallback, changeStatusCb }) => {
  const { admin, name, _id: userId } = user;
  const [selectVal, setVal] = useState(() => {
    if (name === 'Ada' && admin) return 'super admin';
    return admin ? 'admin' : 'common user';
  });
  const disabled = name === 'Ada' && admin;
  const opts = [
    { value: 'admin', name: '管理员' },
    { value: 'common user', name: '普通用户' },
  ];
  if (disabled) {
    opts.push({ name: '超级管理员', value: 'super admin' });
  }
  const onConfirm = async () => {
    const { success } = (await deleteUser({ userId })) || {};
    if (success) {
      delCallback(userId);
    }
  };

  const onChange = async val => {
    const { success } =
      (await changeUserStatus({
        userId,
        status: val === 'admin',
      })) || {};
    if (success) {
      setVal(val);
      changeStatusCb(userId, val === 'admin');
    }
  };
  return (
    <div>
      <span>设置为：</span>
      <Select
        className={styles.select}
        value={selectVal}
        disabled={disabled}
        onChange={e => onChange(e)}
      >
        {opts.map(item => (
          <Select.Option
            key={item.value}
            disabled={disabled}
            value={item.value}
          >
            {item.name}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm title="delete user ?" onConfirm={onConfirm}>
        <a disabled={disabled}>删除</a>
      </Popconfirm>
    </div>
  );
};
