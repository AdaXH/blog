import moment from 'moment';
moment.lang('zh-cn');

export function relativetime(date) {
  if (/ /.test(date)) {
    return moment(date)
      .startOf('minute')
      .fromNow();
  }
  return moment(moment(new Date(Number(date))).format('YYYY-MM-DD/HH:mm:ss'))
    .startOf('minute')
    .fromNow();
}

export function setStyle(index) {
  return {
    animationDelay: `${index / 20}s`,
  };
}
