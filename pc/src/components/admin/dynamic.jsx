import React from 'react';
import { connect } from 'dva';
import Notification from '../../wrapComponent/Notification';
import { Table, Row, Col, Popconfirm, Button } from 'antd';
import styles from './admin.less';

export default connect(({ dynamic: { dynamic } }) => ({ dynamic }))(
  ({ dynamic, dispatch }) => {
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
          <Table rowKey={a => a._id} columns={colmuns} dataSource={dynamic} />
        </Col>
      </Row>
    );
  }
);
