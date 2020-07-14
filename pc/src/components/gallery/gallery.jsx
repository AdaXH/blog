import React from 'react';
import { connect } from 'dva';
import s from './extra.less';

const Extra = ({ image }) => {
  const handleShow = e => {
    const { target } = e.nativeEvent;
    if (target.tagName.toUpperCase() === 'IMG') {
      const mask = document.getElementsByClassName(s.bigImg)[0];
      const IMG_WIDTH = target.offsetWidth;
      const IMG_HEIGHT = target.offsetHeight;
      const img = new Image();
      img.src = target.src;

      const loadFn = _ => {
        const realWidth = _.target.width;
        const MAX_HEIGHT = 500;
        const realHeight = _.target.height;
        const radioWidth = (MAX_HEIGHT * realWidth) / realHeight; // 等比例宽度
        target.style.cssText = `width:${
          realHeight > MAX_HEIGHT ? radioWidth + 'px' : realWidth + 'px'
        }; height: ${
          realHeight > MAX_HEIGHT ? MAX_HEIGHT : realHeight
        }px;opacity: 1; z-index:1;translateX(0)`;
        mask.style.display = 'block';
        mask.addEventListener(
          'click',
          _ => {
            target.style.cssText = `width:${IMG_WIDTH}px; height: ${IMG_HEIGHT}px;opacity: 0.5; z-index:0;`;
            mask.style.display = 'none';
          },
          false
        );
      };

      img.onload = _ => {
        loadFn(_);
      };
    }
  };

  // const reMapImg = src=> (/localhost/.test(window.location) ? '/resouce/extra/1.jpg' : src)

  return (
    <div className={s.extraContainer}>
      <div className={s.bigImg}>
        <div id="imgCon" className={s.imgCon}>
          {/* <img src="" alt="" /> */}
        </div>
      </div>
      <div className={s.galleryContainer} onClick={e => handleShow(e)}>
        {image.map((item, i) => {
          return (
            <div key={i} className={s.imgContainer}>
              {item.imgs.map((_item, i) => {
                return <img key={i} src={_item} alt="" />;
              })}
            </div>
          );
        })}
      </div>
      {/* <div className={s.showStage}>
                    <div className={s.showContainer}>
                    <div className={s.circleOne}></div>
                    <div className={s.circleTwo}></div>
                    <div className={s.circleThree}></div>
                </div>
            </div> */}
      {/* <div className={s.play}>
                <div className={s.time}>
                    <div className={s.start}>01:53</div>
                    <div className={s.line}>
                        <div className={s.dot}></div>
                    </div>
                    <div className={s.end}>04:29</div>
                </div>
                <div className={s.info}>
                    晴天 - 周杰伦
                </div>
                <div className={s.text}>从前从前，有个人爱你很久</div>
                <div className={s.controll}>
                    <div className={s.pre}><i className="iconfont icon-shangyiqu"></i></div>
                    <div className={s.playA}><i className="iconfont icon-bofang1"></i></div>
                    <div className={s.Next}><i className="iconfont icon-xiayiqu"></i></div>
                </div>
            </div> */}
      {/* <div className={s.circleTarget}></div> */}
    </div>
  );
};

export default connect(({ image }) => ({ image }))(Extra);
