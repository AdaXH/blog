import Api from '@/utils/request';
import stringfy from 'qs-stringify';

export async function getComment(data) {
  return Api(`api/netease/get-comment?${stringfy(data)}`);
}

export async function getConfig() {
  return Api('api/getConfig');
}
