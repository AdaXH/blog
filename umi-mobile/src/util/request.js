import fetch from 'dva/fetch';
import Cookies from 'js-cookie';
// import Loading from '../wrapComponent/Loading';
// import Notification from '../wrapComponent/Notification';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function parseError(error) {
  return error instanceof Object ? JSON.stringify(error) : error.toString() || '出错啦：' + error;
}

const isBuild = /5050+|adaxh/.test(window.location.href);
export default function request(url, method = 'GET', data, isSvg = false) {
  const _url_ = isBuild ? url.replace(/\/api/, '') : url;
  if (!isSvg) {
    const options = {
      method,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: Cookies.get('token') || 'null',
        withCredentials: true,
      },
    };
    method === 'POST' && (options.body = JSON.stringify(data));
    return new Promise((resolve, reject) => {
      fetch(_url_, options)
        .then(response => {
          if (response.status >= 200 && response.status < 300) return response.json();
          return response.status;
        })
        .then(result => {
          (typeof result === 'boolean' && result) || result.success
            ? resolve(result)
            : // 可以统一展示err
              console.log('result', result);

          // : Notification.fail({
          //     msg: parseError((result && result.errorMsg) || result),
          //   });
        })
        .catch(err => {
          // 可以统一展示err
          console.log('err', err);
        });
      // .finally(() => !needLoading && Loading.hide());
    });
  } else {
    const options = {
      method,
      headers: {
        'content-type': 'image/svg+xml',
        accept: 'image/svg+xml',
        withCredentials: true,
      },
    };
    return new Promise((resolve, reject) => {
      fetch(_url_, options)
        .then(response => {
          if (response.status >= 200 && response.status < 300) return response.text();
          return response.status;
        })
        .then(response => {
          resolve(response);
        });
    });
  }
}
