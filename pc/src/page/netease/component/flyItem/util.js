export function randomLeft() {
  const { innerWidth } = window;
  const res = Math.random() * innerWidth - 400;
  return res < 1 ? 10 : res;
}
