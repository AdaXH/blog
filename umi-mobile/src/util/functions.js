import moment from 'moment';

export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time * 1000));

export const loadImage = (img) => {
  return new Promise((resolve) => {
    const f = new Image();
    f.src = img || 'https:www.adaxh.site/resouce/images/fly.jpg';
    f.onload = (e) => {
      if (f.complete) {
        resolve(f.src);
        return;
      }
    };
  });
};

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

export function formatTime(time) {
  return moment(new Date(Number(time))).format('YYYY-MM-DD HH:mm');
}
