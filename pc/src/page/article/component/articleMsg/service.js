import Api from '@/utils/request';

export async function discussArticle(data) {
  return Api('api/discussArticle', 'POST', data);
}

export async function deleteArticleMsg(data) {
  return Api('api/deleteArticleMsg', 'POST', data);
}

export async function deleteArticleReplyMsg(data) {
  return Api('api/deleteArticleReplyMsg', 'POST', data);
}

export async function replyArticleMsg(data) {
  return Api('api/replyArticleMsg', 'POST', data);
}
