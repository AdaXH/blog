import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { setCache, getCache, hasChange } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { getDynamic } from '@/utils/service';
import Loading from '../../wrapComponent/Loading';
import Notification from '@/wrapComponent/Notification';
import { Table, Row, Col, Popconfirm, Button } from 'antd';
import styles from './admin.less';

export default connect(() => ({}))(({ dispatch, user }) => {
  const [data, setData] = useState(getCache('moments') || []);
  useDidMount(async () => {
    if (!data.length) Loading.show();
    const result = await getDynamic();
    if (result.success) {
      if (hasChange(data, result.data)) {
        setCache('moments', result.data);
        setData(result.data);
      }
    }
    Loading.hide();
  });
  useEffect(
    () => {
      setCache('moments', data);
    },
    [data]
  );
  const colmuns = [
    {
      title: 'title',
      dataIndex: 'title',
    },
    {
      title: 'content',
      render: data => <div className={styles.content}>{data.content}</div>,
      width: '25%',
    },
    {
      title: 'upvote',
      align: 'center',
      dataIndex: 'upvote',
    },
    {
      title: 'date',
      align: 'center',
      dataIndex: 'date',
    },
    {
      title: 'operation',
      render: record => (
        <div className={styles.operation}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>delete</a>
          </Popconfirm>
          <a onClick={() => handleEdit(record)}>edit</a>
        </div>
      ),
    },
  ];
  const handleEdit = ({ _id, title, content, img }) => {
    dispatch({
      type: 'dialog/open',
      payload: {
        type: 'dynamic',
        dynamic: { _id, title, content, img },
      },
    });
  };
  const handleDelete = _id => {
    dispatch({ type: 'dynamic/deleteById', _id }).then(result => {
      Notification[result.success ? 'success' : 'fail']({
        msg: result.success ? 'delete done' : result,
      });
    });
  };

  return (
    <Row>
      <Col>
        <Button
          type="primary"
          onClick={() =>
            dispatch({
              type: 'dialog/open',
              payload: { type: 'newDynamic', dynamic: {} },
            })
          }
        >
          New
        </Button>
      </Col>
      <Col>
        <Table rowKey={a => a._id} columns={colmuns} dataSource={data} />
      </Col>
    </Row>
  );
});
