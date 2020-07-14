import request from '@/util/request';

export async function queryMoments() {
  return request('/api/getDynamic');
}

export async function upvoteMoment(_id) {
  return request('/api/upvoteDynamic', 'POST', { _id });
}
