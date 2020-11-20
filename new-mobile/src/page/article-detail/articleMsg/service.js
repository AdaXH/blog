import request from '@/util/request';

export async function discussArticle(data) {
  return request('/api/discussArticle', 'POST', data);
}

export async function deleteArticleMsg(data) {
  return request('/api/deleteArticleMsg', 'POST', data);
}

export async function deleteArticleReplyMsg(data) {
  return request('/api/deleteArticleReplyMsg', 'POST', data);
}

export async function replyArticleMsg(data) {
  return request('/api/replyArticleMsg', 'POST', data);
}
