import fetch from 'dva/fetch';
import Cookies from 'js-cookie';
import Loading from '../wrapComponent/Loading';
import Notification from '../wrapComponent/Notification';
import { NO_LOADING_API } from './constant';
// function parseJSON(response) {
//   return response.json();
// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// export function _request(url, options) {
//   return fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(data => ({ data }))
//     .catch(err => ({ err }));
// }

function parseError(error) {
  return error instanceof Object
    ? JSON.stringify(error)
    : error.toString() || '出错啦：' + error;
}

const isBuild = /5050+|adaxh/.test(window.location.href);
export default function Api(url, method = 'GET', data, isSvg = false) {
  const _url_ = isBuild ? url.replace(/api/, '') : url;
  // console.log(_url_)
  const needLoading = NO_LOADING_API.includes(
    /api/.test(_url_) ? _url_.replace(/api/g, '') : _url_
  );
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
      !needLoading && Loading.show({});
      fetch(_url_, options)
        .then(response => {
          if (response.status >= 200 && response.status < 300)
            return response.json();
          return response.status;
        })
        .then(result => {
          (typeof result === 'boolean' && result) || result.success
            ? resolve(result)
            : Notification.fail({
                msg: parseError((result && result.errorMsg) || result),
              });
        })
        .catch(err => Notification.fail({ msg: parseError(err) }))
        .finally(() => !needLoading && Loading.hide());
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
          if (response.status >= 200 && response.status < 300)
            return response.text();
          return response.status;
        })
        .then(response => {
          resolve(response);
        });
    });
  }
}
