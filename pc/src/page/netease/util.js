export function randomKeyword(KEYWORDS) {
  const { length } = KEYWORDS;
  return KEYWORDS[Math.floor(Math.random() * length)];
}
