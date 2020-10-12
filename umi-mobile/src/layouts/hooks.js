let timer = null;

export function debouuce(callback, time = 300) {
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      callback.apply(this, arguments);
      timer = null;
    }, time);
  };
}
