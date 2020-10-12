import moment from 'moment';
moment.lang('zh-cn');

export function setStyle(index) {
  return {
    animationDelay: `${index / 20}s`,
  };
}

export function relativeTime(time) {
  if (isNaN(time)) {
    return moment(time).startOf('minute').fromNow();
  }
  return moment(new Date(Number(time)))
    .startOf('minute')
    .fromNow();
}
