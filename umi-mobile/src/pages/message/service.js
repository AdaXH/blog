import request from '@/util/request';

export async function queryMessage(data) {
  return request('/api/getAllMessage', 'POST', data);
}
