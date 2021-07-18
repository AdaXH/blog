import moment from 'moment';
moment.lang('zh-cn');

export function delay(time) {
  return new Promise((ok) => {
    setTimeout(() => {
      ok();
    }, time * 1000);
  });
}

export const getParam = (search, key) => {
  try {
    if (!search || !key) return null;
    const url = search.slice(1);
    const chunks = url.split('&');
    for (const item of chunks) {
      const [k, value] = item.split('=');
      if (k === key) return value;
    }
    return '';
  } catch (error) {
    console.log('error', error);
    return '';
  }
};

export function setCache(key, data) {
  try {
    window.localStorage.setItem(
      key,
      data instanceof Object ? JSON.stringify(data) : data
    );
  } catch (error) {
    //
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

export function hasChange(data1, data2) {
  return JSON.stringify(data1) !== JSON.stringify(data2);
}

export function relativeTime(time) {
  if (isNaN(time)) {
    return moment(time).startOf('minute').fromNow();
  }
  return moment(new Date(Number(time)))
    .startOf('minute')
    .fromNow();
}

export function formatTime(time) {
  return moment(new Date(Number(time))).format('YYYY-MM-DD HH:mm:ss');
}

export function resetObj(obj) {
  Object.keys(obj).forEach((key) => (obj[key] = ''));
  return obj;
}

export function qqSign() {
  try {
    window.QC.Login.showPopup({
      appId: '101902433',
      redirectURI: 'https://www.adaxh.site/qq',
    });
  } catch (error) {}
}
