import React, { useEffect, useState } from 'react';
import styles from './header.less';
import { NavLink, withRouter } from 'dva/router';
import classnames from 'classnames';
import Notification from '../../wrapComponent/Notification';
import { connect } from 'dva';
import routes from '../../config/router.config';
import { getNavStyle } from './util';

const Header = props => {
  const { dispatch, config, history, user } = props;
  const [style, setStyle] = useState({});
  const [headerStyle, setHeaderStyle] = useState(false);
  const handleSearch = e => {
    const {
      nativeEvent: { target },
    } = e;
    const { dynamic, article } = props;
    if (e.keyCode === 13 && !!target.value && target.value.trim() !== '') {
      dispatch({
        type: 'search/asyncSearch',
        payload: {
          data: target.value,
          allData: [...dynamic, ...article],
        },
      }).then(
        result =>
          result.length === 0 &&
          Notification.fail({ msg: `找不到关于 ${target.value} 相关内容` })
      );
    }
  };

  const handleLine = ({ nativeEvent: { target } }) => {
    const {
      search: { visible },
      dynamicDetail,
      dispatch,
    } = props;
    visible && dispatch({ type: 'search/close' });
    dynamicDetail.visible && dispatch({ type: 'dynamic/closeDetail' });
  };
  const title = (config && config.blogTitle) || 'Ada - Blog';
  useEffect(() => {
    history.listen(() => {
      const {
        location: { pathname },
      } = history;
      setStyle(getNavStyle(pathname, styles));
      setHeaderStyle(pathname === '/friend-ship');
    });
  }, []);
  return (
    <header
      className={classnames({
        [styles.anotherHeader]: headerStyle,
      })}
    >
      <h1 className={styles.logo}>{title}</h1>
      <div className={styles.search}>
        <div
          className={styles.searchIcon}
          onClick={() => {
            document.getElementsByClassName('_searchInput')[0].value = '';
            document.getElementsByClassName('_searchInput')[0].focus();
          }}
        >
          <i className="icon-search iconfont" />
        </div>
        <input
          type="text"
          className="_searchInput"
          placeholder="SEARCH"
          onKeyDown={e => handleSearch(e)}
        />
      </div>
      <ul>
        {routes.map(item => {
          if (item.hidden || (item.permission && !user.admin)) return null;
          return (
            <li onClick={e => handleLine(e)} key={item.url}>
              <NavLink to={item.path} url={item.path}>
                {item.title}
              </NavLink>
            </li>
          );
        })}
        <div className={styles.navLine} style={style} />
      </ul>
    </header>
  );
};

export default connect(
  ({
    search,
    blogConfig: { config },
    dynamic: { dynamicDetail, dynamic },
    article: { data },
    user,
  }) => ({ search, config, dynamicDetail, dynamic, article: data, user })
)(withRouter(Header));
