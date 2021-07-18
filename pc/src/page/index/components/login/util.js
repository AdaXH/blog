export function setContent(
  isLogin,
  { name, email, repeatPassword, pwd }
) {
  return isLogin
    ? [
        { code: 'name', value: name, type: 'text', text: '用户名或邮箱' },
        { code: 'pwd', value: pwd, type: 'password', text: '密码' },
      ]
    : [
        { code: 'name', value: name, type: 'text', text: '用户名' },
        {
          code: 'email',
          value: email,
          type: 'text',
          text: '邮箱',
          placeholder: '邮箱将作为本站交互的通知',
        },
        {
          code: 'emailCode',
          value: null,
          type: 'emailCode',
          email,
          text: '邮箱验证码',
          placeholder: '输入您收到的验证码',
        },
        { code: 'pwd', value: pwd, type: 'password', text: '密码' },
        {
          code: 'repeatPassword',
          value: repeatPassword,
          type: 'password',
          text: '确认密码',
        },
        // { code: 'captcha', value: captcha, type: 'text' },
      ];
}

export function checkValue(type, values) {
  const { name, pwd, repeatPassword, emailCode: captchaCode, email } = values;
  if (type === 'login') {
    if (!name || /\s/.test(name) || !pwd || /\s/.test(pwd)) {
      return '不能为空且不能包含空格';
    }
    return;
  }
  if (!name || /\s/.test(name)) {
    return '用户名不能为空且不能包含空格';
  }
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
    return '邮箱格式不正确';
  }
  if (name.length > 20 || name.length < 3) {
    return '用户名长度3-20';
  }
  if (!pwd || /\s/.test(pwd)) {
    return '密码不能为空且不能包含空格';
  }
  if (pwd.length > 15 || pwd.length < 6) {
    return '密码长度6-15';
  }
  if (pwd !== repeatPassword) {
    return '两次密码不一致';
  }
  if (!captchaCode) {
    return '请输入验证码';
  }
  return false;
}

export function isEmail(email) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
}
