import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import Dynamic from './dynamic';
import Cookies from 'js-cookie';
import Article from './article';
import Config from './config/config';
import Gallery from './galleryManage';
import Friends from './component/friends';
import styles from './admin.less';

const { TabPane } = Tabs;

export default connect(({ dynamic: { dynamic }, article: { data }, user }) => ({
  user,
  dynamic,
  article: data,
}))(props => {
  const tabs = [
    {
      component: () => <Dynamic />,
      description: 'Moments',
    },
    {
      component: () => <Article {...props.history} />,
      description: 'Article',
    },
    {
      component: () => <Gallery />,
      description: 'Gallery',
    },
    {
      component: () => <Config />,
      description: 'Blog config',
    },
    {
      component: () => <Friends />,
      description: 'Friends',
    },
  ];
  const { user } = props;
  const permission = user.isLogin && Cookies.get('user') && user.admin;
  return (
    <div
      className={styles.adminContainer}
      style={{ background: permission ? 'white' : 'none' }}
    >
      {permission ? (
        <Tabs defaultActiveKey="Moments">
          {tabs.map(item => (
            <TabPane tab={item.description} key={item.description}>
              {item.component()}
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <div className={styles.info}>用户没有登陆或无权限</div>
      )}
    </div>
  );
});
