import React from 'react';
import { Pagination } from 'antd';
import styles from './index.less';

export default (props = {}) => <Pagination size="small" {...props} className={styles.pagination} />;
