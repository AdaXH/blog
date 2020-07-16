export const delay = time =>
  new Promise(resolve => setTimeout(() => resolve()), time * 1000);

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
  window.localStorage.setItem(
    key,
    data instanceof Object ? JSON.stringify(data) : data
  );
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
