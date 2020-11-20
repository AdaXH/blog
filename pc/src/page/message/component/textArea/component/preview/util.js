import { EMOJI_PREFIX } from '../emoji/constant';
export function replaceEmoji(value, emojiList) {
  if (!value) return '';
  return replace(value, emojiList);
}

function replace(str, emojiList) {
  emojiList.forEach(({ code, src }) => {
    const reg = new RegExp(`${EMOJI_PREFIX}${code}${EMOJI_PREFIX}`);
    str = str.replace(eval(`${reg}g`), `<img src="${src}"/>`);
  });
  return str;
}
