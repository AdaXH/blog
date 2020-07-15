import React, { useState } from 'react';
import { Table } from 'antd';
import { useDidMount } from '../../../utils/hooks';
import Radio from './operation';
import Input from './input';
import Loading from '../../../wrapComponent/Loading';
import { queryFriends, verifyFriend, deleteFriend } from '../service';

export default props => {
  const [data, setData] = useState([]);
  const onVerify = async ({ verify, _id }) => {
    await verifyFriend({ _id, verify: !verify });
    setData(
      data.map(item => {
        if (item._id === _id) {
          item.verify = !verify;
        }
        return item;
      })
    );
  };
  const onDelete = async _id => {
    await deleteFriend({ _id });
    setData(data.filter(item => item._id !== _id));
  };
  const onSet = async (_id, value, key) => {
    await verifyFriend({ _id, [key]: value });
  };
  useDidMount(async () => {
    try {
      Loading.show();
      const result = await queryFriends();
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
      title: '标题',
      render: d => (
        <Input
          value={d.title}
          onChange={value => onSet(d._id, value, 'title')}
        />
      ),
    },
    {
      title: 'link',
      render: d => (
        <Input value={d.link} onChange={value => onSet(d._id, value, 'link')} />
      ),
    },
    {
      title: '描述',
      render: d => (
        <Input value={d.desc} onChange={value => onSet(d._id, value, 'desc')} />
      ),
    },
    {
      title: '头像',
      render: d => (
        <Input value={d.icon} onChange={value => onSet(d._id, value, 'icon')} />
      ),
    },
    {
      title: '操作',
      render: d => (
        <Radio
          value={d.verify}
          onDelete={() => onDelete(d._id)}
          onChange={() => onVerify(d)}
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
