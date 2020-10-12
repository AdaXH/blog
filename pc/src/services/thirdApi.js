import Api from '@/utils/request';
import stringfy from 'qs-stringify';

export async function getOpenid(data) {
  return Api(
    `api/qq_login?${stringfy({ ...data, unionid: 1 })}&unionid=1&fmt=json`
  );
}
