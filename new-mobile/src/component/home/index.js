import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import QQLogin from '@/page/qqLogin';
import { Component } from '@/common/util';
import Container from './component/container';
import Center from './component/center';

import styles from './index.less';

export default () => {
  return (
    <Router>
      <div className={styles.homeContainer}>
        {/* <div className={styles.bg} /> */}
        {/* <div className={styles.section}> */}
        <Center />
        <Route
          path="/home"
          children={(arg) => (
            <Component
              {...arg}
              classNames={{
                enter: styles.enter,
                exit: styles.exit,
              }}
              // timeout={1000}
              item={() => (
                // <div className={styles.wraper}>
                <Container {...arg} />
                // </div>
              )}
            />
          )}
        />
        <Route path="/qq" component={QQLogin} />
      </div>
      {/* </div> */}
    </Router>
  );
};
// http://localhost:8000/qq?#access_token=4215A288E07597FBE9C7720F99EB5BE8&expires_in=7776000
