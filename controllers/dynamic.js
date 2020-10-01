const Dynamic = require('./../dbmodel/Dynamic');
const User = require('./../dbmodel/User');
const Customer = require('../dbmodel/Customer');
const SinaCloud = require('scs-sdk');
const accessKey = require('../bucketConfig').accessKey;
const { getJWTPayload } = require('../common/util');

const routerExports = {};

routerExports.upvote = {
  method: 'post',
  url: '/upvoteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      const currentDyanmic = await Dynamic.findOne({ _id });
      await Dynamic.updateOne(
        { _id },
        { $set: { upvote: (currentDyanmic.upvote || 0) + 1 } },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.cancelUpvote = {
  method: 'post',
  url: '/cancelUpvote',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      const currentDyanmic = await Dynamic.findOne({ _id });
      await Dynamic.updateOne(
        { _id },
        {
          $set: {
            upvote: currentDyanmic.upvote > 1 ? currentDyanmic.upvote - 1 : 1,
          },
        },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getDynamic = {
  method: 'get',
  url: '/getDynamic',
  route: async (ctx, next) => {
    try {
      // const result = await callGetDynamic()
      const result = await Dynamic.find();
      const temp = [...result].reverse().map((item) => {
        let _result = {};
        if (item._doc)
          _result = {
            ...item._doc,
            img: item._doc.img
              ? item._doc.img
                  .replace(/jpeg+|JPG/g, 'jpg')
                  .replace(/GIF/g, 'gif')
              : '',
          };
        else
          _result = {
            ...item,
            img: item.img
              ? item.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif')
              : '',
          };
        return _result;
      });
      const customer = await Customer.findOne({});
      if (customer && customer.number)
        await Customer.updateOne({}, { $set: { number: customer.number + 1 } });
      ctx.body = {
        success: true,
        data: temp.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.setDynamicImg = {
  method: 'post',
  url: '/setDynamicImg',
  route: async (ctx) => {
    const { name, dataUrl, img: oldImg } = ctx.request.body;
    try {
      const img = await callSetDynamicImgToBucket(name, dataUrl, oldImg);
      ctx.body = {
        success: true,
        img,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callSetDynamicImgToBucket(name, dataUrl, oldImg = '') {
  const bf = Buffer.from(
    dataUrl.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );
  const s3 = new SinaCloud.S3();
  return new Promise((resolve, reject) => {
    if (/ada.bucket/.test(oldImg)) {
      const [oldKey] = oldImg
        .replace('http://sinacloud.net/ada.bucket/', '')
        .split('?KID');
      s3.deleteObject({ Bucket: 'ada.bucket', Key: oldKey }, function (err) {
        if (err) {
          reject(''); // an error occurred
        }
      });
    }

    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: `dynamic_img/${name
          .replace(/jpeg+|JPG/g, 'jpg')
          .replace(/GIF/g, 'gif')}`,
        Body: bf,
      },
      function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(
            `http://sinacloud.net/ada.bucket/dynamic_img/${name
              .replace(/jpeg+|JPG/g, 'jpg')
              .replace(/GIF/g, 'gif')}${accessKey}`,
          );
        }
      },
    );
  });
}

routerExports.discussDynamic = {
  method: 'post',
  url: '/discussDynamic',
  route: async (ctx, next) => {
    const { _id, msg, name } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw 'token认证失败';
      if (!_id || !msg || !name) throw '入参错误';
      const currentDynamic = await Dynamic.findOne({ _id });
      const user = await User.findOne({ _id: payload._id });
      const oldMsg = currentDynamic.msg;
      const newMsg = oldMsg.concat([{ ...msg, name: user.name }]);
      await Dynamic.updateOne({ _id }, { $set: { msg: newMsg } });
      const data = await Dynamic.findById(_id);
      ctx.body = {
        success: true,
        data: data,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleDynamic = {
  method: 'post',
  url: '/deleteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      await Dynamic.deleteOne({ _id });
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

routerExports.addDynamic = {
  method: 'post',
  url: '/addDynamic',
  route: async (ctx, next) => {
    const { title, content, upvote, date, img } = ctx.request.body;
    try {
      await new Dynamic({
        title,
        content,
        upvote,
        date,
        img,
      }).save();
      const result = await Dynamic.find();
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

routerExports.updateDynamic = {
  method: 'post',
  url: '/updateDynamic',
  route: async (ctx, next) => {
    const { body } = ctx.request;
    try {
      const { _id, ...others } = body;
      const result = await Dynamic.updateOne({ _id }, { $set: others });
      ctx.body = result.n !== 0;
    } catch (error) {
      ctx.body = false;
    }
  },
};

routerExports.deleteDynamicMsg = {
  method: 'post',
  url: '/deleteDynamicMsg',
  route: async (ctx, next) => {
    const { _id, msgId } = ctx.request.body;
    try {
      await callDeleteDynamicMsg(_id, msgId);
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callDeleteDynamicMsg(_id, msgId) {
  return new Promise((resolve, reject) => {
    Dynamic.findOne({ _id: msgId })
      .then((data) => {
        if (data) {
          const msg = data.msg.filter(
            (item) => String(item._id) !== String(_id),
          );
          Dynamic.updateOne(
            { _id: msgId },
            {
              $set: {
                msg,
              },
            },
          ).then((ans) => (ans.ok === 1 ? resolve(true) : reject('删除失败')));
        }
      })
      .catch((err) =>
        reject(err instanceof Object ? JSON.stringify(err) : err.toString()),
      );
  });
}

module.exports = routerExports;
