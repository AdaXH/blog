import React from 'react';
import imgs from '../../config/extraGallery';
import Notification from '../../wrapComponent/Notification';
import Api from '../../utils/request';

import styles from './admin.less';

export default props => {
  const handleFile = (e, fileName) => {
    const file = e.nativeEvent.target.files[0];
    const MAX_SIZE = 5;
    if (file.size / 1024 / 1025 > MAX_SIZE) {
      Notification.fail({ msg: '文件不能大于5MB' });
      return;
    }
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)) {
      Notification.fail({ msg: '不支持的图片类型' });
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = async e => {
      try {
        await Api('api/uploadGallery', 'POST', {
          dataUrl: e.target.result,
          fileName,
        });
        Notification.success({ msg: '已更新' + fileName });
        const currrentImg = document.getElementById(
          `__upload__gallery__${fileName}`
        );
        currrentImg.src = e.target.result;
      } catch (error) {
        Notification.fail({ msg: error });
      }
    };
  };

  return (
    <div className={styles.galleryContainer}>
      {imgs.map((item, i) => (
        <div className={styles.cardContainer} key={item}>
          <input
            className={styles.upload}
            type="file"
            title=""
            onChange={info => handleFile(info, `${i + 1}.jpg`)}
          />
          <img id={`__upload__gallery__${i + 1}.jpg`} alt="img" src={item} />
          <span>{`${i + 1}.jpg`}</span>
        </div>
      ))}
    </div>
  );
};
