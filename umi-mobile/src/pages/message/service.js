import request from '@/util/request';

export async function queryMessage() {
  return request('/api/getAllMessages');
}
