export function escapeData(data) {
  return data
    .replace(
      /<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g,
      ''
    )
    .replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g, '**');
}

export function getDate() {
  let date = new Date();
  let minute = date.getMinutes();
  const m = minute < 10 ? '0' + minute : minute;
  let hour = date.getHours();
  const h = hour < 10 ? '0' + hour : hour;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const ms = month < 10 ? '0' + month : month;
  let day = date.getDate();
  const _day = day < 10 ? '0' + day : day;
  return year + '-' + ms + '-' + _day + '-----' + h + ' : ' + m;
}
