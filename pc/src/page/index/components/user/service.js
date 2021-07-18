import request from '../../../../utils/request';

export async function updateUserInfo(data) {
  return request('api/updateUserInfo', 'POST', data);
}

export async function getCode(data) {
  return request('api/getCode', 'POST', data);
}
