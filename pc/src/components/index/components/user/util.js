import Notification from '../../../../wrapComponent/Notification';

export function handleFile(file, dispatch, userName, callback) {
  const { name } = file;
  if (!/image/.test(file.type)) {
    Notification.fail({ msg: '不支持的图片类型' });
    return;
  }
  const fileReader = new FileReader();
  fileReader.readAsBinaryString(file);
  fileReader.onload = e => {
    dispatch({
      type: 'user/setAvatar',
      payload: {
        avatar: e.target.result,
        name: userName,
        fileName: name,
      },
    }).then(result => {
      Notification[result.success ? 'success' : 'fail']({
        msg: result.success ? '头像更新成功' : '头像更新失败',
      });
      if (result.src && callback) {
        callback(result.src.avatar);
      }
    });
  };
}

export function validatorPwd(rule, value, callback, password) {
  try {
    if (password && value !== password) {
      throw new Error('两次密码不一致!');
    }
    if (password && !value) {
      throw new Error('请确认密码!');
    }
    return Promise.resolve();
  } catch (error) {
    console.log('error', error);
    callback(error);
  }
}
