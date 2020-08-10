import moment from 'moment';
moment.lang('zh-cn');

export function relativetime(date) {
  if (/ /.test(date)) {
    return moment(date).startOf('minute').fromNow();
  }
  return moment(new Date(Number(date))).format('YYYY-MM-DD HH:mm:ss');
  // return moment(moment(new Date(Number(date))).format('YYYY-MM-DD/HH:mm:ss'))
  //   .startOf('minute')
  //   .fromNow();
}
