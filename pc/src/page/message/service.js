import Api from '@/utils/request';

export async function leaveMessage(data) {
  return Api('api/leaveMsg', 'POST', data);
}

export async function deleteMsgById(data) {
  return Api('api/deleteMsgById', 'POST', data);
}

export async function repeatMsg(data) {
  return Api('api/repeatmsg', 'POST', data);
}

export async function deleteInnerRepeat(data) {
  return Api('api/deleteInnerRepeat', 'POST', data);
}

export function getAllMessage(data) {
  return Api('api/getAllMessage', 'POST', data);
}

export async function getEmojis() {
  return Api('api/getEmojis');
}
