import moment from 'moment';
moment.lang('zh-cn');

export function setStyle(index) {
  return {
    animationDelay: `${index / 3}s`,
  };
}

export function relativetime(date) {
  let target = Number(date);
  if (/-/.test(date)) {
    target = new Date(date).getTime();
  }
  return moment(moment(new Date(target)).format('YYYY-MM-DD/HH:mm:ss'))
    .startOf('minute')
    .fromNow();
}
