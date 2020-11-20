import request from '@/util/request';

export async function queryFriends() {
  return request('/api/queryFriends');
}

export async function addFriend(data) {
  return request('/api/addFriend', 'POST', data);
}
