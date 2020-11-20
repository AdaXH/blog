export function getSearch(str) {
  try {
    const result = {};
    const serachSrt = str.slice(1);
    const seractArr = serachSrt.split('&');
    seractArr.forEach((item) => {
      const [key, value] = item.split('=');
      result[key] = value;
    });
    return result;
  } catch (error) {
    return {};
  }
}
