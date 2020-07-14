export const delay = time => new Promise(resolve => setTimeout(() => resolve(), time * 1000));

export const loadImage = img => {
  return new Promise(resolve => {
    const f = new Image();
    f.src = img || 'https:www.adaxh.site/resouce/images/fly.jpg';
    f.onload = e => {
      if (f.complete) {
        resolve(f.src);
        return;
      }
    };
  });
};

export function setCache(key, data) {
  window.localStorage.setItem(key, data instanceof Object ? JSON.stringify(data) : data);
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
