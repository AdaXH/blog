import { ARTICLE_TYPE } from './constant';

export function filterData(data, type) {
  // 按时间筛选文章
  if (!isNaN(type)) {
    return data.filter((item) => {
      if (item.year) return item.year === type;
      const year = new Date(Number(item.date)).getFullYear() + '';
      return type === year;
    });
  }
  if (type === 'All' || type === 'Time') return data;
  return data.filter((item) => item.type === type);
}

export function getHotArticle(data) {
  if (!data.length) return [];
  const sortData = data.sort((a, b) => a.viewer - b.viewer);
  return sortData.slice(0, 3);
}

export function changeUnderline(target, item, cb) {
  const types = document.querySelectorAll('._articleTyle');
  const SLIDE_MARGIN = 50;
  types[types.length - 1].style.transform = `translateX(${
    target.offsetLeft - SLIDE_MARGIN
  }px) translateY(${target.offsetTop - SLIDE_MARGIN}px)`;
  types[types.length - 1].style.width = `${target.offsetWidth + 20}px`;

  if (target.getAttribute('current') === 'true') return;
  for (let _item = 0; _item < types.length; _item++) {
    if (_item < types.length - 1) {
      item && types[_item].setAttribute('current', 'false');
      item && (types[_item].style.cssText = 'color: white; cursor: pointer');
    }
  }
  !!item && item !== 'Time' && target.setAttribute('current', 'true');
  target.style.cssText =
    'color: #f54c53;' + (item !== 'Time' && 'cursor: not-allowed');
  cb(item);
}

export function getArticleType(data) {
  const extrct = {};
  const extrctArr = [];
  const type = ['All', ...ARTICLE_TYPE];
  if (data.length) {
    for (let item of data) {
      const key = item.year || new Date(Number(item.date)).getFullYear() + '';
      !extrct[key] ? (extrct[key] = 1) : (extrct[key] = extrct[key] + 1);
    }
  }
  for (let key in extrct) {
    !type.includes(key) && type.push(key);
    extrctArr.push({ year: key, value: extrct[key] });
  }
  // 加 ‘’是因为吧最后一个当作underline
  return [...type, ''];
}
