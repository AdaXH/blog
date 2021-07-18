import showdown from 'showdown';

const converter = new showdown.Converter();

export function replaceEmoji(value, emojiList) {
  if (!value) return '';
  return replace(value, emojiList);
}
const EMOJI_PREFIX = '::';
function replace(str, emojiList) {
  emojiList.forEach(({ code, src }) => {
    const reg = new RegExp(`${EMOJI_PREFIX}${code}${EMOJI_PREFIX}`, 'g');
    str = str.replace(reg, `<img src="${src}"/>`);
  });
  return str;
}
export function getHtml(comment, emojiList = []) {
  return converter.makeHtml(replaceEmoji(comment, emojiList));
}
