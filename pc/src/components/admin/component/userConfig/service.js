import Api from '@/utils/request';

export async function queryUsers(data) {
  return Api('api/queryUsers', 'POST', data);
}

export async function deleteUser(data) {
  return Api('api/deleteUser', 'POST', data);
}

export async function changeUserStatus(data) {
  return Api('api/changeUserStatus', 'POST', data);
}
