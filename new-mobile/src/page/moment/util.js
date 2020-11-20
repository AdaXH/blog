export function mapUrl(url) {
  if (/sinacloud.net\/ada.bucket/.test(url)) {
    return url;
  }
  if (/upload\/dynamic_img/.test(url)) {
    return `https://adaxh.applinzi.com/${url}`;
  }
  return url;
}
