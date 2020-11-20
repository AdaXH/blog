import { useState } from 'react';
import Cookies from 'js-cookie';
import { useDidMount } from '@/util/hooks';
import { getOpenid } from './service';

export default ({ history }) => {
  const [loginFinish, setStatus] = useState(false);
  useDidMount(async () => {
    try {
      if (history.location.hash) {
        const [param] = history.location.hash.split('&');
        // eslint-disable-next-line
        const [_, access_token] = param.split('=');
        if (access_token) {
          Cookies.remove('user');
          Cookies.remove('token');
          await getOpenid({ access_token });
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setStatus(true);
    }
  });
  if (loginFinish) {
    history.push('/');
  }
  return null;
};
