export function replaceStr(str) {
  if (str.endsWith('。')) {
    return str.slice(0, -1);
  }
  return str;
}
