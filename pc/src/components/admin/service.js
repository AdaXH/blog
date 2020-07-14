import Api from '../../utils/request';

export async function verifyFriend(data) {
  return Api('api/verifyFriend', 'POST', data);
}

export async function queryFriends() {
  return Api('api/queryFriends');
}
