import request from '@/util/request';

export async function queryArticleById(body) {
  return request('/api/queryArticleById', 'POST', body);
}
