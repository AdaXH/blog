import Api from '../../utils/request';

export async function queryFriends() {
  return Api('api/queryFriends');
}

export async function addFriend(data) {
  return Api('api/addFriend', 'POST', data);
}
