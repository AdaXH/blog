const routerExports = {};
const User = require("./../dbmodel/User");
const fs = require("fs");
const Base64 = require("js-base64").Base64;
const SinaCloud = require("scs-sdk");
// const accessKey = require('../bucketConfig').accessKey
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const { getJWTPayload, parseToken, reMapError } = require("../common/util");
const { findOne } = require("./../dbmodel/User");

const secret = "secret";

function getToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: "1day" });
}

routerExports.uploadGallery = {
  method: "post",
  url: "/uploadGallery",
  route: async ctx => {
    const { fileName, dataUrl } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const { _id: userId } = tokenParse;
      const user = await User.findOne({ _id: userId });
      if (!user.admin) throw "当前用户无权限";
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
  const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ""), "base64");

  return new Promise((resolve, reject) => {
    const s3 = new SinaCloud.S3();
    s3.putObject(
      {
        ACL: "public-read",
        Bucket: "ada.bucket",
        Key: `extra/${fileName.replace(/jpeg+|JPG/g, "jpg")}`,
        Body: bf,
      },
      function (error, response) {
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
  method: "post",
  url: "/getCaptcha",
  route: async ctx => {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: "",
      noise: 2,
      color: true,
      background: "transparent",
    });
    ctx.session = {};
    ctx.session.captcha = captcha.text;
    ctx.body = captcha.data;
  },
};

routerExports.setPics = {
  method: "post",
  url: "/setPics",
  route: async ctx => {
    const { type, binary } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const { _id: userId } = tokenParse;
      const user = await User.findOne({ _id: userId });
      if (!user.admin) throw "当前用户无权限";
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
    const bf = Buffer(binary, "binary");
    fs.writeFile(`./public/resouce/images/${type}.jpg`, bf, err => {
      if (err === null) {
        User.findOne({ name: "Ada" })
          .then(result => {
            if (result) {
              const picData = result.pics || { glitchUrl: " ", flyUrl: "" };
              picData[
                type === "glitch" ? "glitchUrl" : "flyUrl"
              ] = `resouce/imagses/${type}.jpg`;
              User.updateOne(
                { name: "Ada" },
                { $set: { pics: { ...picData } } }
              )
                .then(res => (res ? resolve() : reject("更新出错")))
                .catch(err =>
                  reject(
                    err instanceof Object ? JSON.stringify(err) : err.toString()
                  )
                );
            }
          })
          .catch(err =>
            reject(err instanceof Object ? JSON.stringify(err) : err.toString())
          );
      } else
        reject(
          "保存文件时出错" + err instanceof Object
            ? JSON.stringify(err)
            : err.toString()
        );
    });
  });
};

routerExports.login = {
  method: "post",
  url: "/login",
  route: async (ctx, next) => {
    const { name, pwd, state } = ctx.request.body;
    const date = new Date();
    date.setDate(date.getDate() + 2);
    try {
      // const result = await callLogin(name, pwd, state, email)
      const findUser = await User.findOne({ name });
      const findEmail = await User.findOne({ email: name });
      if (!findUser && !findEmail) {
        throw "账号不存在";
      }
      const userWidthName = await User.findOne({ name, password: pwd });
      const userWidthEmail = await User.findOne({
        email: name,
        password: pwd,
      });
      const user = userWidthName || userWidthEmail;
      if (!user) {
        throw "账号和密码不匹配";
      }
      state &&
        ctx.cookies.set("user", Base64.encode(name), {
          expires: date,
          httpOnly: false,
          overwrite: false,
        });
      ctx.cookies.set("token", getToken({ _id: user._id }), {
        expires: date,
        httpOnly: false,
        overwrite: false,
      });
      delete user._doc.password;
      user.name = name;
      console.log(name + " 上线");
      ctx.body = {
        success: true,
        ...user._doc,
        token: getToken({ _id: user._id }),
      };
    } catch (error) {
      console.log("error", error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getUserInfor = {
  // 新版本废物
  method: "post",
  url: "/getUserInfor",
  route: async (ctx, next) => {
    const { name } = ctx.request.body;
    try {
      const user = await callGerUser(name);
      delete user._doc.password;
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

routerExports.getUserInfoByToken = {
  method: "post",
  url: "/getUserInfoByToken",
  route: async (ctx, next) => {
    try {
      const {
        headers: { authorization },
      } = ctx;
      if (!authorization || authorization === "null") {
        return (ctx.body = {
          success: true,
          user: { isLogin: false },
        });
      }
      const payload = getJWTPayload(authorization);
      if (!payload) throw "token认证失败";
      const user = await User.findOne({ _id: payload._id });
      delete user._doc.password;
      console.log(user.name + " 重新连接");
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

function callGerUser(name) {
  return new Promise((resolve, reject) => {
    User.findOne({ name })
      .then(res => {
        res ? resolve(res) : reject("当前用户不存在");
      })
      .catch(err => reject("无法获取当前用户信息"));
  });
}

function callLogin(name, pwd, _, email) {
  return new Promise((resolve, reject) => {
    User.findOne({ name }).then(res =>
      !res
        ? reject("用户不存在")
        : User.findOne({
            name,
            password: pwd,
          }).then(res => {
            res
              ? resolve({
                  success: true,
                  _id: res._id,
                  admin: res.admin || false,
                  avatar: res.avatar || false,
                })
              : reject("用户名与密码不匹配");
          })
    );
  });
}

routerExports.introduce = {
  method: "post",
  url: "/introduce",
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
    User.findOne({ name: "Ada" })
      .then(res => {
        if (res) resolve(res.introduce);
        else reject("查询失败");
      })
      .catch(err => reject(err));
  });
}

routerExports.updateIntroduce = {
  method: "post",
  url: "/updateIntroduce",
  route: async (ctx, next) => {
    const { introduce } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const tokenParse = parseToken(authorization);
      const { _id: userId } = tokenParse;
      const user = await User.findOne({ _id: userId });
      if (!user.admin) throw "当前用户无权限";
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
      .then(res => {
        res.ok === 1 ? resolve(true) : reject("更新失败");
      })
      .catch(err => reject(err));
  });
}

routerExports.getAvatar = {
  method: "post",
  url: "/get-avatar",
  route: async (ctx, res) => {
    const { name } = ctx.request.body;
    const na = JSON.parse(Base64.decode(name)).name;
    await User.findOne({ name: na })
      .then(data => {
        data
          ? (ctx.body = {
              success: true,
              data: data.avatar,
            })
          : (ctx.body = {
              success: false,
              errorMsg: "无法获取头像",
            });
      })
      .catch(err => {
        ctx.body = {
          success: false,
          errorMsg: error,
        };
      });
  },
};

routerExports.allAvatar = {
  // 将废弃
  method: "post",
  url: "/all_user_avatar",
  route: async (ctx, next) => {
    const { name } = ctx.request.body;
    try {
      const result = await getAvatar(name);
      ctx.body = {
        success: true,
        data: result,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function getAvatar(names) {
  const result = [];
  if (names === "all") {
    return new Promise((resolve, reject) => {
      User.find({})
        .then(data => {
          const imgs = data.map(item => item.avatar);
          imgs ? resolve(imgs) : reject("头像获取失败");
        })
        .catch(err => reject(err));
    });
  } else
    return new Promise((reslove, reject) => {
      User.find({}).then(data => {
        for (let item of names)
          for (let item1 of data)
            item === item1.name &&
              result.push({ name: item1.name, avatar: item1.avatar });
        result.length !== 0 ? reslove(result) : reject("用户表为空");
      });
    });
}

routerExports.setAvatar = {
  method: "post",
  url: "/set-avatar",
  route: async (ctx, res) => {
    const { avatar, name, fileName } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "token认证失败";
      // const userName = await User.findOne({ _id: payload._id })
      const src = await callSaveAvatarToBucket(avatar, payload._id, fileName);
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
  const bf = Buffer(avatar, "binary");
  const imgs = fileName.split(".");
  const imgType = /gif+|GIF/.test(imgs[imgs.length - 1]) ? "gif" : "jpg";

  return new Promise((resolve, reject) => {
    const newAvatar = `http://sinacloud.net/ada.bucket/avatar/${fileName}${_id}.${imgType}`;
    const s3 = new SinaCloud.S3();
    s3.putObject(
      {
        ACL: "public-read",
        Bucket: "ada.bucket",
        Key: `avatar/${fileName}${_id}.${imgType}`,
        Body: bf,
      },
      function (error, response) {
        if (error) {
          reject(error);
        } else {
          User.updateOne({ _id }, { $set: { avatar: newAvatar } }).then(data =>
            data.n === 1
              ? resolve({ avatar: newAvatar, bf })
              : reject("头像更新失败")
          );
        }
      }
    );
  });
}

routerExports.register = {
  method: "post",
  url: "/register",
  route: async (ctx, nect) => {
    const { name, pwd, captchaCode, email } = ctx.request.body;
    try {
      const {
        session: { captcha },
      } = ctx;
      if (!captcha) throw "服务器繁忙，请重试";
      if (captcha.toLowerCase() !== captchaCode.toLowerCase())
        throw "验证码不正确";
      const hasUser = await User.findOne({ name });
      if (hasUser) throw "用户已存在";
      const hasEmail = await User.findOne({ email });
      if (email && hasEmail) throw "该邮箱已注册";
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
  method: "post",
  url: "/updateUserInfo",
  route: async ctx => {
    const { _id, ...others } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload || payload._id !== _id) throw "token认证失败";
      // 检测邮箱是否已被使用过
      if (others.email) {
        const curUser = await User.findOne({ _id });
        if (curUser && curUser.email !== others.email) {
          const exitEmail = await User.findOne({ email: others.email });
          if (exitEmail) {
            throw "该邮箱已被注册";
          }
        }
      }
      // 检测用户名是否已被使用过
      if (others.name) {
        const curUser = await User.findOne({ _id });
        if (curUser && curUser.name !== others.name) {
          const exitName = await User.findOne({ name: others.name });
          if (exitName) {
            throw "用户名已存在";
          }
        }
        others.originName = curUser.name;
      }
      if ("admin" in others) {
        delete others.admin;
      }
      await User.updateOne({ _id }, { $set: others });
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

module.exports = routerExports;
