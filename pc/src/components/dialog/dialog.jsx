import React, { useState } from 'react';
import styles from './dialog.less';
import Notification from '../../wrapComponent/Notification';
import { connect } from 'dva';

const Dialog = (props) => {
  const { dialog, dispatch } = props;
  const isDynamic = dialog.type && dialog.type === 'dynamic';
  const isNew = dialog.type && dialog.type === 'newDynamic';
  const title = (isDynamic && dialog.dynamic.title) || '';
  const content = (isDynamic && dialog.dynamic.content) || '';
  const [img, setImg] =
    isNew || isDynamic
      ? useState({
          url: isDynamic
            ? /ada.bucket/.test(dialog.dynamic.img)
              ? dialog.dynamic.img
              : 'upload/dynamic_img/' + dialog.dynamic.img
            : '',
          name: isDynamic ? dialog.dynamic.img : '',
        })
      : ['', ''];
  const setDynamicImg = (_id, imgP) => {
    return dispatch({
      type: 'dynamic/setDynamicImg',
      payload: {
        dataUrl: img.url,
        name: img.name,
        _id,
        img: dialog.dynamic.img,
      },
    });
  };

  const onSubmit = async () => {
    const data = document.querySelector('.dialogText').value;

    if (!dialog.dynamic) {
      // 非moments场景直接回调
      dialog.cb && dialog.cb(data);
    } else {
      // new moments
      const {
        dynamic: { _id, title, content, img: curImg },
        type,
      } = dialog;
      const _title = document.querySelector('#editTitle').value;
      if (type === 'newDynamic') {
        // new
        if (!_title || !data || _title.trim() === 0 || data.trim() === 0) {
          Notification.fail({ msg: 'not avaliabe !' });
          return;
        }

        const setImgResult = await setDynamicImg(_id, curImg);
        if (setImgResult)
          Notification[setImgResult.success ? 'success' : 'fail']({
            msg: setImgResult.success ? 'upload success' : setImgResult,
          });
        await dispatch({
          type: 'dynamic/addDynamic',
          date: Date.now(),
          title: _title,
          content: data,
          img: setImgResult.img,
          upvote: 1,
        }).then((result) => {
          result.success && dispatch({ type: 'dialog/hide' });
          Notification[result.success ? 'success' : 'fail']({
            msg: result.success ? 'success' : result,
          });
        });
      } else {
        // edit
        if (
          title === _title &&
          content === data &&
          /upload\/dynamic_img/.test(img.name)
        )
          Notification.fail({ msg: '内容未更改！' });
        else {
          const setImgResult = await setDynamicImg(_id);
          if (setImgResult)
            Notification[setImgResult.success ? 'success' : 'fail']({
              msg: setImgResult.success ? 'upload success' : setImgResult,
            });
          const payload = {
            title: _title,
            content: data,
            _id,
          };
          if (dialog.dynamic.img !== img.url) {
            payload.img = setImgResult.img;
          }
          await dispatch({
            type: 'dynamic/updateDynamic',
            ...payload,
          }).then((result) => {
            Notification[result ? 'success' : 'fail']({
              msg: result ? 'success' : result,
            });
            result && dispatch({ type: 'dialog/hide' });
          });
        }
      }
    }
  };

  const handleFile = (info) => {
    const file = info.nativeEvent.target.files[0];
    const { name } = file;
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)) {
      Notification.fail({ msg: '不支持的图片类型' });
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => setImg({ url: e.target.result, name });
  };

  return (
    <div>
      {dialog.visible && (
        <div className={styles.dialogContainer}>
          <div
            onClick={() => dispatch({ type: 'dialog/hide' })}
            className={styles.dialogMask}
          />
          <div
            className={styles.dialogContent}
            style={{
              marginTop: (isNew || isDynamic) && '-300px',
              height: (isNew || isDynamic) && '600px',
            }}
          >
            {(isDynamic || isNew) && (
              <input
                id="editTitle"
                placeholder="title here"
                className={styles.dynamicTitle}
                defaultValue={title}
              />
            )}
            <textarea
              style={{ height: `${isDynamic || isNew ? '300px' : '340px'}` }}
              onChange={(e) => handleKeyDown(e, props)}
              defaultValue={content}
              placeholder={dialog.placeholder || ''}
              className="dialogText"
              autoFocus
            />
            {(isDynamic || isNew) && (
              <div className={styles.editImg}>
                <img id="dynamicImgEdit" src={img.url} alt="img" />
                <input
                  onChange={(e) => handleFile(e, props)}
                  type="file"
                  className={styles.editUpload}
                />
              </div>
            )}
            <div className={styles.dialogOperation}>
              <div
                onClick={() => dispatch({ type: 'dialog/hide' })}
                className={styles.dialogCancel}
              >
                <i className="icon-quxiao iconfont" />
              </div>
              <div
                onClick={() => onSubmit(props)}
                className={styles.dialogSubmit}
              >
                <i className="icon-queding iconfont" />
              </div>
            </div>
            <div className={styles.info}>
              {dialog.currentLength} / {dialog.maxInput}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function handleKeyDown(e, { dispatch, dialog }) {
  const { length } = e.target.value;
  dispatch({
    type: 'dialog/renderInput',
    payload: {
      currentLength: length > dialog.maxInput ? dialog.maxInput : length,
    },
  });
  if (length > dialog.maxInput) {
    e.target.value = e.target.value.slice(0, dialog.maxInput + 1);
    return;
  }
}

export default connect(({ dialog }) => ({ dialog }))(Dialog);
