import React, { useEffect, useState, useRef } from 'react';
import { NavLink, withRouter } from 'dva/router';
import Notification from '@/wrapComponent/Notification';
import classnames from 'classnames';
import { connect } from 'dva';
import routes from '@/config/router.config';
import { getCache } from '@/utils/functions';
import { FULL_SCREEN_PATH } from '@/utils/constant';
import Menu from './component/menu';
import { getNavStyle } from './util';
import styles from './header.less';

const Header = (props) => {
  const {
    dispatch,
    history,
    user,
    search: { visible },
    dynamicDetail,
  } = props;
  const [style, setStyle] = useState({});
  const [headerStyle, setHeaderStyle] = useState(false);
  const [blogTitle, setTitle] = useState('Home');
  const inputRef = useRef({});
  const handleSearch = (e) => {
    const {
      nativeEvent: { target },
    } = e;
    const moments = getCache('moments') || [];
    const articles = getCache('articles') || [];
    if (e.keyCode === 13 && !!target.value && target.value.trim() !== '') {
      dispatch({
        type: 'search/asyncSearch',
        payload: {
          data: target.value,
          allData: [...moments, ...articles],
        },
      }).then(
        (result) =>
          result.length === 0 &&
          Notification.fail({
            msg: `找不到关于 ${target.value} 相关内容`,
          })
      );
    }
  };

  const handleLine = () => {
    visible && dispatch({ type: 'search/close' });
    dynamicDetail.visible && dispatch({ type: 'dynamic/closeDetail' });
  };
  useEffect(() => {
    history.listen(() => {
      const {
        location: { pathname },
      } = history;
      setStyle(getNavStyle(pathname, styles));
      setHeaderStyle(
        FULL_SCREEN_PATH.includes(pathname) && pathname.replace(/\/+|-/g, '')
      );
      const { title, newTitle } =
        routes.find((item) => {
          if (!item.childRoutes) {
            return item.path === pathname;
          }
          return item.childRoutes.find((iItem) => {
            item.newTitle = iItem.title;
            return iItem.path === pathname;
          });
        }) || {};
      document.title = 'Ada - ' + (newTitle || title || 'Blog');
      setTitle(newTitle || title);
    });
  }, []);
  const onFocusSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };
  function renderLinks(links) {
    return links.map((item) => {
      const { hidden, permission, type, childRoutes, path, title } = item;
      if (hidden || (permission && !user.admin)) return null;
      let content = (
        <NavLink to={path} url={path}>
          {title}
        </NavLink>
      );
      if (type === 'more' && childRoutes.length) {
        content = (
          <Menu routes={childRoutes} parent={item} admin={user.admin} />
        );
      }
      return (
        <li onClick={(e) => handleLine(e)} key={path}>
          {content}
        </li>
      );
    });
  }
  return (
    <header
      className={classnames({
        [styles[headerStyle]]: true,
      })}
    >
      <h1 className={styles.logo}>
        Ada -{' '}
        <span key={blogTitle} className={styles.blogTitle}>
          {blogTitle}
        </span>
      </h1>
      <div className={styles.search}>
        <div className={styles.searchIcon} onClick={onFocusSearch}>
          <i className="icon-search iconfont" />
        </div>
        <input
          ref={inputRef}
          placeholder="SEARCH"
          onKeyDown={(e) => handleSearch(e)}
        />
      </div>
      <ul>
        {renderLinks(routes)}
        <div className={styles.navLine} style={style} />
      </ul>
    </header>
  );
};

export default connect(({ search, dynamic: { dynamicDetail }, user }) => ({
  search,
  dynamicDetail,
  user,
}))(withRouter(Header));
