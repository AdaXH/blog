import request from '@/util/request';

export async function queryFriends() {
  return request('/api/queryFriends');
}
