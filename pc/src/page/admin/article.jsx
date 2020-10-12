import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Select, Input } from 'antd';
import { setCache, getCache, hasChange } from '@/utils/functions';
import { useDidMount } from '@/utils/hooks';
import { getArticles } from '@/utils/service';
import Notification from '@/wrapComponent/Notification';
import Loading from '@/wrapComponent/Loading';
import types from '../../config/articleType';
import { Editor } from '@tinymce/tinymce-react';
import { queryArticleById } from './service';
import { EDIT_CONFIG } from './constant';
import styles from './admin.less';

const { Option } = Select;

const AticleManage = (props) => {
  const { dispatch } = props;
  const [data, setData] = useState(getCache('articles') || []);
  useDidMount(async () => {
    if (!data.length) Loading.show();
    const result = await getArticles();
    if (result.success) {
      if (hasChange(data, result.data)) {
        setCache('articles', result.data);
        setData(result.data);
      }
    }
    Loading.hide();
  });
  const [state, setState] = useState({
    summary: null,
    _type: 'HTML',
    quillHtml: '',
    _id: '',
    newArticle: {
      visible: false,
      target: '',
    },
    columns: [
      {
        title: 'type',
        dataIndex: 'type',
      },
      {
        title: 'title',
        dataIndex: 'title',
        render: (data) => <div className={styles.summary}>{data}</div>,
        width: '300',
      },
      {
        title: 'date',
        align: 'center',
        dataIndex: 'date',
      },
      {
        title: 'operation',
        render: (record) => (
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
    ],
  });

  const {
    newArticle: { target, visible },
    _id,
    _type,
    summary,
    columns,
    title,
    abstract,
  } = state;
  const iRef = useRef(null);
  const abRef = useRef(null);
  const handleEdit = async (data) => {
    const curArticle = await queryArticleById({ _id: data._id });
    if (curArticle.success) {
      setState({
        ...state,
        newArticle: { visible: true, target: 'edit' },
        summary: curArticle.data.summary,
        _type: data.type,
        _id: data._id,
        title: data.title,
        abstract: data.abstract,
      });
    }
  };

  const handleDelete = (_id) => {
    dispatch({ type: 'article/deleteArticle', _id }).then((result) => {
      Notification[result.success ? 'success' : 'fail']({
        msg: result.success ? 'delete done' : result,
      });
    });
  };

  const handleChange = (value) => setState({ ...state, summary: value });

  const changeType = (value) => setState({ ...state, _type: value });

  const submit = () => {
    const title = iRef.current.state.value;
    const abstract = abRef.current.state.value;
    if (target === 'edit') {
      dispatch({
        type: 'article/updateArticle',
        _id,
        _type,
        summary,
        title,
        abstract,
      }).then((result) => {
        const { success } = result;
        success &&
          setState({
            ...state,
            newArticle: { visible: false },
            summary: '',
            _type: 'HTML',
          });
        Notification[success ? 'success' : 'fail']({
          msg: success ? 'success' : result,
        });
      });
    } else {
      const arg = {
        summary,
        type: _type,
        title,
        date: Date.now(),
        abstract,
      };
      dispatch({
        type: 'article/publishArticle',
        arg,
      }).then((result) => {
        const { success } = result;
        success &&
          setState({
            ...state,
            newArticle: { visible: false },
            summary: '',
            _type: 'HTML',
          });
        Notification[success ? 'success' : 'fail']({
          msg: success ? 'success' : result,
        });
      });
    }
  };
  const onCreate = () =>
    setState({
      ...state,
      text: '',
      type: 'HTML',
      summary: '',
      newArticle: { visible: true, target: 'add' },
    });

  return (
    <div className={styles.articleManage}>
      {visible ? (
        <div className={styles.quillContainer}>
          <div>
            <span>文章类型：</span>
            <Select
              defaultValue={_type}
              onChange={(value) => changeType(value)}
              className={styles.typeSelect}
            >
              {types.map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </div>
          <div className={styles.inputTitle}>
            <span>文章标题：</span>
            <Input defaultValue={title} ref={iRef} placeholder="文章标题" />
          </div>
          <div className={styles.inputTitle}>
            <span>文章摘要：</span>
            <Input defaultValue={abstract} ref={abRef} placeholder="文章摘要" />
          </div>
          <Button
            type="danger"
            className={styles.backBtn}
            onClick={() =>
              setState({
                ...state,
                newArticle: { visible: false },
              })
            }
          >
            close
          </Button>
          <Editor
            inline={false}
            apiKey="9n7y9p4e9tu5iuw1a37ohq9djn77pfwsx22zatodcpi6x69b"
            initialValue={summary}
            init={EDIT_CONFIG}
            onEditorChange={handleChange}
          />
          <div>
            <Button
              style={{ marginRight: '20px' }}
              type="primary"
              onClick={submit}
            >
              submit
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <Button type="primary" onClick={onCreate}>
            New
          </Button>
          <Table rowKey={(a) => a._id} columns={columns} dataSource={data} />
        </div>
      )}
    </div>
  );
};
export default connect(({ user }) => ({
  user,
}))(AticleManage);
