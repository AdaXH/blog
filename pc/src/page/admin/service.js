import Api from '../../utils/request';

export async function verifyFriend(data) {
  return Api('api/verifyFriend', 'POST', data);
}

export async function queryFriends() {
  return Api('api/queryFriends');
}

export async function deleteFriend(data) {
  return Api('api/deleteFriend', 'POST', data);
}

export async function queryArticleById(data) {
  return Api('api/queryArticleById', 'POST', data);
}

export async function getConfig() {
  return Api('api/getConfig');
}

export async function updateConfig(data) {
  return Api('api/updateConfig', 'POST', data);
}
