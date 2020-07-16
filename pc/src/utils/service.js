import Api from './request';

export async function getDynamic() {
  return Api('api/getDynamic');
}

export async function getArticles() {
  return Api('api/getArticles');
}

export async function getAllMessages() {
  return Api('api/getAllMessages');
}

export async function queryFriends() {
  return Api('api/queryFriends');
}
