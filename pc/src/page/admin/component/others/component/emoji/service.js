import Api from '@/utils/request';

export async function getEmojis() {
  return Api('api/getEmojis');
}

export async function updateEmoji(data) {
  return Api('api/updateEmoji', 'POST', data);
}
