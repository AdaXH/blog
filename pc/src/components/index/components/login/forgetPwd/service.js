import Api from '@/utils/request';

export function sendCodeToEmail(data) {
  return Api('api/sendCodeToEmail', 'POST', data);
}

export function resetPassword(data) {
  return Api('api/resetPassword', 'POST', data);
}
