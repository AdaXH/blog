import React, { useState } from 'react';
import { Table } from 'antd';
import { useDidMount } from '@/utils/hooks';
import { formatTime } from '@/utils/functions';
import Loading from '@/wrapComponent/Loading';
import Operation from './operation';
import { queryUsers } from './service';
import styles from './index.less';

export default props => {
  const [data, setData] = useState([]);
  const delCallback = _id => setData(data.filter(item => item._id !== _id));
  const changeStatusCb = (_id, admin) => {
    setData(
      data.map(item => {
        if (item._id === _id) {
          item.admin = admin;
        }
        return item;
      })
    );
  };
  useDidMount(async () => {
    try {
      Loading.show();
      const result = await queryUsers();
      if (result.success) {
        const { data: res } = result;
        setData(res || []);
      }
    } catch (error) {
    } finally {
      Loading.hide();
    }
  });
  const colmuns = [
    {
      title: '用户',
      render: ({ name, avatar }) => (
        <div>
          <img src={avatar} alt="avatar" className={styles.avatar} />
          {name}
        </div>
      ),
    },
    {
      title: '上次登陆',
      render: d => <span>{formatTime(d.lastLoginTime)}</span>,
    },
    {
      title: '身份',
      render: ({ admin, name }) => (
        <div>
          {name === 'Ada' ? '超级管理员' : admin ? '管理员' : '普通用户'}
        </div>
      ),
    },
    {
      title: '操作',
      render: d => (
        <Operation
          user={d}
          changeStatusCb={changeStatusCb}
          delCallback={delCallback}
        />
      ),
    },
  ];
  return (
    <Table
      pagination={{ pageSize: 6 }}
      rowKey={a => a._id}
      columns={colmuns}
      dataSource={data}
    />
  );
};
