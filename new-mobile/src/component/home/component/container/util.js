import { NAVS } from './constant';

export function getRoutes() {
  const result = [];
  NAVS.forEach((item) => {
    if (item.menus) {
      item.menus.forEach((cItem) => {
        result.push(cItem);
      });
    }
  });
  return result;
}

export function getEnter(e) {
  switch (e.index) {
    case 0:
      return {
        rotate: 90,
        opacity: 0,
        y: -60,
      };
    case 10:
    case 1:
      return {
        y: -60,
        x: -10,
        opacity: 0,
      };
    case 9:
    case 2:
      return {
        y: -60,
        x: 20,
        opacity: 0,
      };
    case 3:
      return {
        y: 60,
        opacity: 0,
      };
    case 8:
    case 4:
      return {
        x: 30,
        opacity: 0,
      };
    case 5:
      return {
        enter: [
          {
            scale: 2,
            opacity: 0,
            type: 'set',
          },
          { scale: 1.2, opacity: 1, duration: 300 },
          { scale: 0.9, duration: 200 },
          { scale: 1.05, duration: 150 },
          { scale: 1, duration: 100 },
        ],
        leave: {
          opacity: 0,
          scale: 0,
        },
      };
    case 6:
      return {
        scale: 0.8,
        x: 30,
        y: -10,
        opacity: 0,
      };
    case 7:
      return {
        scale: 0.8,
        x: 30,
        y: 10,
        opacity: 0,
      };
    default:
      return {
        opacity: 0,
      };
  }
}
