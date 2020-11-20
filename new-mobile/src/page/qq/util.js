import Cookies from 'js-cookie';

export function removeInfo() {
  [
    '.adaxh.site',
    'www.adaxh.site',
    'adaxh.site',
    'localhost',
    'adaxh.applinzi.com',
    'www.adaxh.applinzi.com',
  ].forEach((domain) => {
    Cookies.remove('user', {
      domain,
    });
    Cookies.remove('token', { domain });
  });
}
