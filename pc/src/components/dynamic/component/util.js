import moment from 'moment';
moment.lang('zh-cn');
export function getDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (day < 10 ? '0' + day : day) +
    '--' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute)
  );
}

export function relativetime(date) {
  let target = date;
  if (/--/.test(date)) {
    target = new Date(date.replace(/--/g, '/')).getTime();
  }
  return moment(moment(new Date(Number(target))).format('YYYY-MM-DD/HH:mm:ss'))
    .startOf('minute')
    .fromNow();
}
