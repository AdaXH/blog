import request from '@/util/request';

export async function leaveMessage(data) {
  return request('/api/leaveMsgv2', 'POST', data);
}
