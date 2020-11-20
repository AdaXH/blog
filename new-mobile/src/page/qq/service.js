import request from '@/util/request';
import stringfy from 'qs-stringify';

export async function getOpenid(data) {
  return request(`/api/qq_login?${stringfy({ ...data, unionid: 1 })}&unionid=1&fmt=json`);
}

export async function getUserInfo(data) {
  return request('/api/getUserInfoByToken', 'POST');
}
