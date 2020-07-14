

export function getNavStyle(pathname, styles) {
    const lis = document.querySelectorAll('header ul li');
    for (let item of lis) {
        const anchor = item.querySelector('a');
        if (anchor.getAttribute('url') === pathname) {
            const MARGIN_LEFT = 10;
            const width = anchor.offsetWidth;
            const left = anchor.offsetLeft + MARGIN_LEFT;
            const line = document.getElementsByClassName(styles.navLine)[0];
            line.style.cssText = `transform: translateX(${left}px); width: ${width}px`;
            return {
                transform: `translateX(${left}px)`,
                width: `${width}px`,
            };
        }
    }
    return { };
}