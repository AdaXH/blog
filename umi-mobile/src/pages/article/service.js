import request from '@/util/request';

export async function getArticles() {
  return request('/api/getArticles');
}
