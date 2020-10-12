export function getNavStyle(pathname, styles, ans) {
  const lis = ans || document.querySelectorAll('header ul li');
  for (const item of lis) {
    const anchor = ans ? item : item.querySelector('a');
    const url = anchor && anchor.getAttribute('href');
    if (url && pathname.includes(url)) {
      const MARGIN_LEFT = 10;
      const width = anchor.offsetWidth;
      const offsetLeft = !ans
        ? anchor.offsetLeft
        : anchor.parentNode.parentNode.offsetLeft;
      const left = offsetLeft + MARGIN_LEFT;
      const line = document.getElementsByClassName(styles.navLine)[0];
      line.style.cssText = `transform: translateX(${left}px); width: ${width}px`;
      return {
        transform: `translateX(${left}px)`,
        width: `${width}px`,
      };
    } else {
      const innerAnchor = anchor ? anchor.querySelectorAll('a') : [];
      if (innerAnchor.length) {
        return getNavStyle(pathname, styles, innerAnchor);
      }
    }
  }
  return {};
}
