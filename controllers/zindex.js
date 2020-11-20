const Message = require('../dbmodel/Message');
const Article = require('../dbmodel/Article');
const Dynamic = require('../dbmodel/Dynamic');
const Customer = require('../dbmodel/Customer');
const Mood = require('../dbmodel/Mood');
const { setAllAvatar } = require('../common/apiPrefix');

const routerExports = {};

routerExports.getCustomer = {
  method: 'get',
  url: '/get-customer',
  route: async (ctx) => {
    try {
      const data = await callGetCustomer();
      ctx.body = {
        success: true,
        data,
      };
    } catch (error) {
      ctx.body = {
        success: true,
        errorMsg: error,
        data: {},
      };
    }
  },
};

function callGetCustomer() {
  return new Promise((resolve, reject) => {
    Customer.findOne({})
      .then((data) => {
        data ? resolve(data) : reject('网络出错');
      })
      .catch((err) =>
        reject(err instanceof Object ? JSON.stringify(err) : err.toString()),
      );
  });
}

routerExports.addCustomer = {
  method: 'post',
  url: '/add-customer',
  route: async (ctx, next) => {
    ctx.body = true;

    //   try {
    //     const customer = await Customer.findOne({});
    //     if (customer.number)
    //       await Customer.updateOne({}, { $set: { number: customer.number + 1 } });
    //     ctx.body = true;
    //   } catch (error) {
    //     ctx.body = false;
    //   }
  },
};

function moodArr(time) {
  return new Promise((resolve, reject) => {
    // console.log('pc: ' + new Date())
    console.log('native: ' + time);
    Mood.find({}, (err, res) => {
      err ? reject([]) : resolve(res);
    });
  });
}

function articleArr() {
  return new Promise((resolve, reject) => {
    Article.find({}, (err, res) => {
      const result = res
        .sort((a, b) => {
          return (
            new Date(b.year + '-' + b.date).getTime() -
            new Date(a.year + '-' + a.date).getTime()
          );
        })
        .map((item) => {
          delete item._doc.summary;
          return item;
        });
      err ? reject([]) : resolve(result);
    });
  });
}

function dynamicArr() {
  return new Promise((resolve, reject) => {
    Dynamic.find({}, (err, res) => {
      err ? reject([]) : resolve(res.reverse());
    });
  });
}

function messageArr() {
  return new Promise((resolve, reject) => {
    Message.find({}, (err, res) => {
      err ? reject([]) : resolve(res);
    });
  });
}
/// <h2>+\w{1,}<\/h2>/.exec('aaa11111<h2>title</h2>
routerExports.getArticles = {
  method: 'get',
  url: '/getArticles',
  route: async (ctx, next) => {
    try {
      const article = await Article.find(
        {},
        {
          summary: 0,
        },
      );
      const newArticle = article.reverse().map((item) => {
        const { year, date, time = '0:0:0' } = item;
        if (/-/.test(date)) {
          item.date = new Date(`${year}-${date}/${time}`);
        }
        return item;
      });
      ctx.body = { success: true, data: newArticle };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getAllMessages = {
  method: 'get',
  url: '/getAllMessages',
  route: async (ctx) => {
    try {
      ctx.body = { success: true };
      const result = await Message.find({}).sort({ _id: -1 });
      const msgWithAvatar = await setAllAvatar(result);
      ctx.body = { success: true, data: msgWithAvatar };
    } catch (err) {
      ctx.body = {
        success: false,
        errorMsg: err,
      };
    }
  },
};

routerExports.routerIndex = {
  method: 'get',
  url: '/*',
  route: async (ctx, next) => {
    const userAgent = /Mobile+|iPhone+|Android/.test(
      ctx.request.header['user-agent'],
    )
      ? 'Mobile'
      : 'pc';
    const {
      request: { url },
    } = ctx;
    const date = new Date();
    const time = `${url || ''} : ${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}号 : ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`;

    // Mobile
    if (/search/.test(url)) {
      await ctx.render('search');
      return;
    }
    if (userAgent === 'Mobile') {
      await ctx.render(/old/.test(url) ? 'mobile' : 'new-mobile');
    } else if (/twui/.test(url)) {
      console.log('twui: ', time);
      await ctx.render('twui');
    } else if (/native/.test(url)) {
      // console.log('Native:  ' + time)
      if (userAgent === 'pc') {
        // native-version
        try {
          const mood = await moodArr(time);
          const article = await articleArr();
          const message = await messageArr();
          const dynamic = await dynamicArr();
          const dynamicTemp = dynamic.map((item) => {
            let result = {};
            if (item._doc)
              result = {
                ...item._doc,
                img: item._doc.img ? item._doc.img.replace(/jpeg/g, 'jpg') : '',
              };
            else
              result = {
                ...item,
                img: item.img ? item.img.replace(/jpeg/g, 'jpg') : '',
              };
            return result;
          });
          await ctx.render('native', {
            title: 'Ada - 个人主页',
            mood,
            article,
            message: message.reverse(),
            dynamic: dynamicTemp,
          });
        } catch (error) {
          await ctx.render('native', {
            title: 'Ada - 个人主页',
            mood: [],
            article: [],
            message: [],
            dynamic: [],
          });
        }
      }
    }
    // Dva
    else {
      // console.log('dva:    ' + time)
      await ctx.render('pc');
    }
  },
};
// routerExports.superSU = {
//   method: 'post',
//   url: '/supersu',
//   route: async (ctx) => {
//     try {
//       const payload = getJWTPayload(ctx.headers.authorization);
//       if (!payload) throw 'nndsnnds';
//       const user = await User.findOne({ _id: payload._id });
//       if (!user || !user.admin) throw 'token error';
//       const msgs = await Message.find({});
//       msgs.forEach(async (item) => {
//         const { userId, name, _id, repeat } = item;
//         // if (!userId) {
//         const result = await queryUser({ userId, name });
//         if (result.userId) {
//           await Message.updateOne(
//             { _id },
//             {
//               $set: { ...result },
//             }
//           );
//         }
//         // item.userId = newId;
//         // item.avatar = avater;
//         // }
//         if (repeat) {
//           const newRepeat = [];
//           for await (const i of repeat) {
//             const { toRepeatUser, userId } = i;
//             // if (!toRepeatUser || !toRepeatUser.userId) {
//             const newUser = await queryUser({
//               userId: toRepeatUser.userId,
//               name: i.toRepeat,
//             });
//             if (newUser.userId) {
//               i.toRepeatUser = { ...toRepeatUser, ...newUser };
//             }
//             // }
//             // console.log('userId', userId);
//             // if (!userId) {
//             const nUser = await queryUser({ name: i.name });
//             const { userId: nId, avatar } = nUser;
//             i.userId = nId;
//             i.avatar = avatar;
//             // }
//             newRepeat.push(i);
//           }
//           // console.log("newRepeat", newRepeat);
//           await Message.updateOne(
//             { _id },
//             {
//               $set: { repeat: newRepeat },
//             }
//           );
//         }
//       });
//       ctx.body = { success: true, msgs };
//     } catch (error) {
//       ctx.body = { success: false, errorMsg: error };
//     }
//   },
// };
module.exports = routerExports;
