import React from 'react';
import moment from 'moment';

import ReactDOM from 'react-dom';
import styles from './util.less';

export function setCache(key, data) {
  try {
    window.localStorage.setItem(key, data instanceof Object ? JSON.stringify(data) : data);
  } catch (error) {
    // ingore
  }
}

export function getCache(key) {
  const str = window.localStorage.getItem(key);
  if (str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      return str;
    }
  }
  return null;
}

const mountComponent = (component) => {
  const parent = document.getElementById('__wrapComponent__');
  if (!parent) {
    const __wrapComponent__ = document.createElement('div');
    __wrapComponent__.id = '__wrapComponent__';
    document.body.appendChild(__wrapComponent__);
  }
  ReactDOM.render(component(), document.getElementById('__wrapComponent__'));
};

const showLoading = (destory) => {
  const component = () => {
    if (destory) return null;
    return (
      <div className={styles.loading}>
        <i className="iconfont icon-loading-solid" />
      </div>
    );
  };
  mountComponent(component);
};

export const Loading = {
  show: () => showLoading(false),
  hide: () => showLoading(true),
};

let timer;
export function debounce(callback, time = 1000) {
  // if (!canDo) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    callback();
  }, time);
}

export function renderTime(time) {
  if (/-----|\//.test(time)) return time.replace(/-----/, '-');
  return moment(new Date(Number(time))).format('YYYY-MM-DD HH:mm');
}

export function formatTime(time) {
  return moment(new Date(Number(time))).format('YYYY-MM-DD HH:mm');
}
