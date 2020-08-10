import React from 'react';
import { Pagination } from 'antd';
// import { itemRender } from './util';
import styles from './index.less';

export default props => {
  const { total, pageSize, current = 1, onChange } = props;
  return (
    <div className={styles.pageCon}>
      <Pagination
        total={total}
        pageSize={pageSize}
        current={current}
        onChange={onChange}
      />
    </div>
  );
};
