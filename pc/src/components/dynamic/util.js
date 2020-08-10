import moment from 'moment';
moment.lang('zh-cn');

export function randromCurrent(start = 0, end = 5) {
  const lis = document.getElementsByClassName('_dynamicItem');
  if (!!lis) {
    for (let _start = start; _start <= end; _start++) {
      if (lis[_start]) {
        const duration = Math.random() * 3;
        lis[_start].style.display = 'block';
        lis[_start].style.opacity = '1';
        setTimeout(() => {
          lis[_start].style['transition-duration'] = duration + 's';
          lis[_start].style.transform = `translate3d(0,0,0)`;
        }, 0);
      }
    }
  }
}

export function randomItem() {
  const lis = document.querySelectorAll('._dynamicItem');
  if (!!lis) {
    for (let i = 0; i < lis.length; i++) {
      const x = (Math.random() + 1) * 500;
      const op = parseInt(x, 10) % 2 === 0 ? -1 : 1;
      const y = (Math.random() + 1) * 300;
      lis[i].style.opacity = '0';
      lis[
        i
      ].style.transform = `translateX(${x}px) translateZ(${x}px) translateY(${
        op * y
      }px)`;
      lis[i].style.display = 'none';
    }
  }
}

export function relativetime(date) {
  let target = Number(date);
  if (/-/.test(date)) {
    target = new Date(date).getTime();
  }
  return moment(new Date(target)).format('YYYY-MM-DD HH:mm:ss');
  // return moment(moment(new Date(target)).format('YYYY-MM-DD/HH:mm:ss'))
  //   .startOf('minute')
  //   .fromNow();
}
