const routerExports = {};
const User = require('./../dbmodel/User');
const fs = require('fs');
const Base64 = require('js-base64').Base64;
const SinaCloud = require('scs-sdk');
// const accessKey = require('../bucketConfig').accessKey
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const {
  getJWTPayload,
  parseToken,
  randomCode,
  sendEmail,
} = require('../common/util');

const secret = 'secret';

function getToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: '1day' });
}

routerExports.uploadGallery = {
  method: 'post',
  url: '/uploadGallery',
  route: async (ctx) => {
    const { fileName, dataUrl } = ctx.request.body;
    try {
      await callSaveGalleryToBucket(fileName, dataUrl);
      ctx.body = {
        success: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callSaveGalleryToBucket(fileName, dataUrl) {
  const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  return new Promise((resolve, reject) => {
    const s3 = new SinaCloud.S3();
    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: `extra/${fileName.replace(/jpeg+|JPG/g, 'jpg')}`,
        Body: bf,
      },
      function(error, response) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

routerExports.getCaptcha = {
  method: 'post',
  url: '/getCaptcha',
  route: async (ctx) => {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '',
      noise: 2,
      // color: false,
      // background: "white",
    });
    ctx.session = {};
    ctx.session.captcha = captcha.text;
    ctx.body = captcha.data;
  },
};

routerExports.setPics = {
  method: 'post',
  url: '/setPics',
  route: async (ctx) => {
    const { type, binary } = ctx.request.body;
    try {
      await callHandlePic(type, binary);
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

const callHandlePic = (type, binary) => {
  return new Promise((resolve, reject) => {
    const bf = Buffer(binary, 'binary');
    fs.writeFile(`./public/resouce/images/${type}.jpg`, bf, (err) => {
      if (err === null) {
        User.findOne({ name: 'Ada' })
          .then((result) => {
            if (result) {
              const picData = result.pics || { glitchUrl: ' ', flyUrl: '' };
              picData[
                type === 'glitch' ? 'glitchUrl' : 'flyUrl'
              ] = `resouce/imagses/${type}.jpg`;
              User.updateOne(
                { name: 'Ada' },
                { $set: { pics: { ...picData } } }
              )
                .then((res) => (res ? resolve() : reject('更新出错')))
                .catch((err) =>
                  reject(
                    err instanceof Object ? JSON.stringify(err) : err.toString()
                  )
                );
            }
          })
          .catch((err) =>
            reject(err instanceof Object ? JSON.stringify(err) : err.toString())
          );
      } else
        reject(
          '保存文件时出错' + err instanceof Object
            ? JSON.stringify(err)
            : err.toString()
        );
    });
  });
};

routerExports.login = {
  method: 'post',
  url: '/login',
  route: async (ctx, next) => {
    const { name, pwd, state } = ctx.request.body;
    const date = new Date();
    date.setDate(date.getDate() + 2);
    try {
      // const result = await callLogin(name, pwd, state, email)
      const findUser = await User.findOne({ name });
      const findEmail = await User.findOne({ email: name });
      if (!findUser && !findEmail) {
        throw '账号不存在';
      }
      const userWidthName = await User.findOne({ name, password: pwd });
      const userWidthEmail = await User.findOne({
        email: name,
        password: pwd,
      });
      const user = userWidthName || userWidthEmail;
      if (!user) {
        throw '账号和密码不匹配';
      }
      state &&
        ctx.cookies.set('user', Base64.encode(name), {
          expires: date,
          httpOnly: false,
          overwrite: false,
        });
      ctx.cookies.set('token', getToken({ _id: user._id }), {
        expires: date,
        httpOnly: false,
        overwrite: false,
      });
      delete user._doc.password;
      user.name = name;
      console.log(name + ' 上线');
      await User.updateOne(
        { name: user.name },
        { $set: { lastLoginTime: Date.now() } }
      );
      ctx.body = {
        success: true,
        ...user._doc,
        token: getToken({ _id: user._id }),
      };
    } catch (error) {
      console.log('error', error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getUserInfoByToken = {
  method: 'post',
  url: '/getUserInfoByToken',
  route: async (ctx, next) => {
    try {
      const {
        headers: { authorization },
      } = ctx;
      if (!authorization || authorization === 'null') {
        return (ctx.body = {
          success: true,
          user: { isLogin: false },
        });
      }
      const payload = getJWTPayload(authorization);
      if (!payload) throw 'token认证失败';
      const user = await User.findOne({ _id: payload._id });
      delete user._doc.password;
      console.log(user.name + ' 重新连接');
      await User.updateOne(
        { _id: payload._id },
        { $set: { lastLoginTime: Date.now() } }
      );
      ctx.body = {
        success: true,
        user,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.introduce = {
  method: 'post',
  url: '/introduce',
  route: async (ctx, next) => {
    try {
      const introduce = await callIntroduce();
      ctx.body = {
        success: true,
        introduce: String(introduce),
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callIntroduce() {
  return new Promise((resolve, reject) => {
    User.findOne({ name: 'Ada' })
      .then((res) => {
        if (res) resolve(res.introduce);
        else reject('查询失败');
      })
      .catch((err) => reject(err));
  });
}

routerExports.updateIntroduce = {
  method: 'post',
  url: '/updateIntroduce',
  route: async (ctx, next) => {
    const { introduce } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const { _id: userId } = tokenParse;
      await callUpdateIntroduce(introduce);
      ctx.body = {
        success: true,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callUpdateIntroduce(introduce) {
  return new Promise((resolve, reject) => {
    User.updateOne({ $set: { introduce } })
      .then((res) => {
        res.ok === 1 ? resolve(true) : reject('更新失败');
      })
      .catch((err) => reject(err));
  });
}

routerExports.getAvatar = {
  method: 'post',
  url: '/get-avatar',
  route: async (ctx, res) => {
    const { name } = ctx.request.body;
    const na = JSON.parse(Base64.decode(name)).name;
    await User.findOne({ name: na })
      .then((data) => {
        data
          ? (ctx.body = {
              success: true,
              data: data.avatar,
            })
          : (ctx.body = {
              success: false,
              errorMsg: '无法获取头像',
            });
      })
      .catch((err) => {
        ctx.body = {
          success: false,
          errorMsg: error,
        };
      });
  },
};

routerExports.setAvatar = {
  method: 'post',
  url: '/set-avatar',
  route: async (ctx, res) => {
    const { avatar, name, fileName } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const src = await callSaveAvatarToBucket(
        avatar,
        tokenParse._id,
        fileName
      );
      ctx.body = {
        success: true,
        src,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

async function callSaveAvatarToBucket(avatar, _id, fileName) {
  const bf = Buffer(avatar, 'binary');
  const imgs = fileName.split('.');
  const imgType = /gif+|GIF/.test(imgs[imgs.length - 1]) ? 'gif' : 'jpg';

  return new Promise((resolve, reject) => {
    const newAvatar = `http://sinacloud.net/ada.bucket/avatar/${fileName}${_id}.${imgType}`;
    const s3 = new SinaCloud.S3();
    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: `avatar/${fileName}${_id}.${imgType}`,
        Body: bf,
      },
      function(error, response) {
        if (error) {
          reject(error);
        } else {
          User.updateOne({ _id }, { $set: { avatar: newAvatar } }).then(
            (data) =>
              data.n === 1
                ? resolve({ avatar: newAvatar, bf })
                : reject('头像更新失败')
          );
        }
      }
    );
  });
}

routerExports.register = {
  method: 'post',
  url: '/register',
  route: async (ctx, nect) => {
    const { name, pwd, captchaCode, email } = ctx.request.body;
    try {
      const {
        session: { captcha },
      } = ctx;
      if (!captcha) throw '服务器繁忙，请重试';
      if (captcha.toLowerCase() !== captchaCode.toLowerCase())
        throw '验证码不正确';
      const hasUser = await User.findOne({ name });
      if (hasUser) throw '用户已存在';
      const hasEmail = await User.findOne({ email });
      if (email && hasEmail) throw '该邮箱已注册';
      const saveUser = await new User({
        name,
        password: pwd,
        email,
      }).save();
      delete saveUser._doc.password;
      ctx.body = {
        success: true,
        ...saveUser._doc,
      };
    } catch (error) {
      // console.log(error)
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.updateUserInfo = {
  method: 'post',
  url: '/updateUserInfo',
  route: async (ctx) => {
    const { _id, ...others } = ctx.request.body;
    try {
      // 检测邮箱是否已被使用过
      if (others.email) {
        const curUser = await User.findOne({ _id });
        if (curUser && curUser.email !== others.email) {
          const exitEmail = await User.findOne({ email: others.email });
          if (exitEmail) {
            throw '该邮箱已被注册';
          }
        }
      }
      // 检测用户名是否已被使用过
      if (others.name) {
        const curUser = await User.findOne({ _id });
        if (curUser && curUser.name !== others.name) {
          const exitName = await User.findOne({ name: others.name });
          if (exitName) {
            throw '用户名已存在';
          }
        }
        others.originName = curUser.name;
      }
      if ('admin' in others) {
        delete others.admin;
      }
      if ('superAdmin' in others) {
        delete others.superAdmin;
      }
      await User.updateOne({ _id }, { $set: others });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports.queryUsers = {
  method: 'post',
  url: '/queryUsers',
  route: async (ctx) => {
    try {
      const users = await User.find(
        {},
        {
          name: 1,
          lastLoginTime: 1,
          email: 1,
          avatar: 1,
          admin: 1,
        }
      ).sort({ lastLoginTime: -1 });
      ctx.body = { success: true, data: users };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports.changeUserStatus = {
  method: 'post',
  url: '/changeUserStatus',
  route: async (ctx) => {
    const {
      request: {
        body: { userId, status },
      },
      headers: { authorization },
    } = ctx;
    try {
      const payload = getJWTPayload(authorization);
      const { superAdmin, admin } = await User.findOne(
        { _id: payload._id },
        { admin: 1, superAdmin: 1 }
      );
      if (!admin || !superAdmin) throw '暂无权限';
      await User.updateOne({ _id: userId }, { $set: { admin: status } });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports.deleteUser = {
  method: 'post',
  url: '/deleteUser',
  route: async (ctx) => {
    const {
      request: {
        body: { userId },
      },
      headers: { authorization },
    } = ctx;
    try {
      const payload = getJWTPayload(authorization);
      const { superAdmin, admin } = await User.findOne({ _id: payload._id });
      if (!admin || !superAdmin) {
        throw '暂无权限';
      }
      await User.deleteOne({ _id: userId });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports.sendCodeToEmail = {
  method: 'post',
  url: '/sendCodeToEmail',
  route: async (ctx) => {
    try {
      const {
        request: {
          body: { email },
        },
      } = ctx;
      const user = await User.findOne({ email });
      if (!user) {
        throw '该邮箱未注册，如果您注册时没有绑定邮箱，请找管理员帮您绑定';
      }
      const emailCode = randomCode(4);
      ctx.session.emailCode = emailCode;
      sendEmail(
        `hi~ ${
          user.name
        }：\n这是您在https://adaxh.site\n找回密码的验证码：${emailCode}\n请妥善保管，以防泄漏`,
        email,
        '找回密码-验证码'
      );
      ctx.body = {
        success: true,
      };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports.resetPassword = {
  method: 'post',
  url: '/resetPassword',
  route: async (ctx) => {
    try {
      const {
        request: {
          body: { code, pwd, email },
        },
      } = ctx;
      if (code !== ctx.session.emailCode) {
        throw '验证码不正确';
      }
      const user = await User.findOne({ email });
      if (!user) throw '用户已不存在!';
      await User.updateOne({ email }, { $set: { password: pwd } });
      ctx.body = {
        success: true,
      };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

module.exports = routerExports;
