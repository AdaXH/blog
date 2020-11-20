import request from '@/util/request';

export async function queryMessage(data) {
  return request('/api/getAllMessage', 'POST', data);
}

export async function leaveMessage(data) {
  return request('/api/leaveMsgv2', 'POST', data);
}

export async function deleteMsgById(data) {
  return request('/api/deleteMsgById', 'POST', data);
}

export async function getEmojis() {
  return request('/api/getEmojis');
}
