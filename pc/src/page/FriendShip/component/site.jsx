import React from 'react';
import { SITE } from './constant';
import Notification from '../../../wrapComponent/Notification';
import copy from 'copy-to-clipboard';
import styles from '../index.less';

const { title, desc, avatar, link } = SITE;

export default () => {
  const onCopy = () => {
    if (copy(avatar)) {
      Notification.success({ msg: '已复制到剪贴板' });
    }
  };
  return (
    <div className={styles.site}>
      <h4>站点信息</h4>
      <div>标题：{title}</div>
      <div>描述：{desc}</div>
      <div>链接：{link}</div>
      <div>
        头像：<a onClick={onCopy}>点击复制头像地址</a>
      </div>
    </div>
  );
};
