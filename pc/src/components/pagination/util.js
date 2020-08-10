import React from 'react';
import { Icon } from 'antd';
import utilStyles from './index.less';

export function itemRender(current, type, originalElement, allPageCunt) {
  const MAX_COUNT = 5;
  if (type === 'prev') {
    return (
      <a className={utilStyles.commonDir}>
        <Icon type="left" />
        上一页
      </a>
    );
  }
  if (type === 'next') {
    return (
      <a className={utilStyles.commonDir}>
        下一页
        <Icon type="right" />
      </a>
    );
  }
  if (type === 'page' && current > MAX_COUNT && allPageCunt === current) {
    return <a>共{allPageCunt}页</a>;
  }
  return <span className={utilStyles.defaultPag}>{originalElement}</span>;
}
