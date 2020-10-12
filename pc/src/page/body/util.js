import { DEFAULT_IMG } from './constant';

export function getRandomBg(list) {
  if (!list || !list.length) return false;
  return list[Math.floor(Math.random() * list.length)];
}

export async function loadImg({ img: src, color }) {
  let img = null;
  try {
    img = await getURLBase64(src);
  } catch (e) {
    img = DEFAULT_IMG;
    color = 'rgba(0,0,0,0.35)';
  } finally {
    return { img, color };
  }
}

function getURLBase64(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status === 200) {
        const blob = this.response;
        const fileReader = new FileReader();
        fileReader.onloadend = function (e) {
          const result = e.target.result;
          resolve(result);
        };
        fileReader.readAsDataURL(blob);
      }
    };
    xhr.onerror = function () {
      reject();
    };
    xhr.send();
  });
}
