import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import Dynamic from './dynamic';
import Cookies from 'js-cookie';
import Article from './article';
import Config from './component/config/index';
import Gallery from './galleryManage';
import Friends from './component/friends';
import Users from './component/userConfig';
import styles from './admin.less';

const { TabPane } = Tabs;

export default connect(({ user }) => ({
  user,
}))((props) => {
  const tabs = [
    { component: () => <Dynamic />, description: 'Moments', title: '动态' },
    {
      component: () => <Article {...props.history} />,
      description: 'Article',
      title: '文章',
    },
    { component: () => <Gallery />, description: 'Gallery', title: '图库' },
    {
      component: () => <Config />,
      description: 'Blog config',
      title: '主页配置',
    },
    { component: () => <Friends />, description: 'Friends', title: '友情链接' },
    { component: () => <Users />, description: 'Users', title: '用户' },
  ];
  const { user } = props;
  const permission = user.isLogin && Cookies.get('user') && user.admin;
  return (
    <div className={styles.adminContainer}>
      {permission ? (
        <Tabs defaultActiveKey="Moments">
          {tabs.map((item) => (
            <TabPane tab={item.title} key={item.description}>
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
