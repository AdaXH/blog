import Api from '@/utils/request';

export function getCatpch() {
  return Api('api/get');
}

export async function getEmailCode(data) {
  return Api('api/getEmailCode', 'POST', data);
}