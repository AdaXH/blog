// export function getDate() {
//   const d = new Date();
//   let months = d.getMonth() + 1;
//   let day = d.getDate();
//   let date =
//     (months < 10 ? `0${months}` : months) + '-' + (day < 10 ? `0${day}` : day);
//   const year = '' + d.getFullYear();
//   const h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
//   const m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
//   const styles = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
//   const time = `${h}:${m}:${styles}`;
//   return {
//     date,
//     time,
//     year,
//   };
// }
