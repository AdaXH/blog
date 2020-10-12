export function validateObj(obj) {
  return Object.keys(obj).some(key => !obj[key].trim());
}
