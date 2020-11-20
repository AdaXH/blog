const SinaCloud = require('scs-sdk');
const Emoji = require('./../dbmodel/Emoji');

const s3 = new SinaCloud.S3();
const routerExports = {};
const BUCKET_NAME = 'emoji';

routerExports.updateEmoji = {
  method: 'post',
  url: '/updateEmoji',
  route: async (ctx) => {
    const {
      body: { _id, code, dataUrl, fileType, isDel = false },
    } = ctx.request;
    try {
      if (isDel) {
        s3.deleteObject(
          {
            Bucket: 'ada.bucket',
            Key: `${BUCKET_NAME}/${code}.${fileType}`,
          },
          function (err) {
            if (err) {
              throw err;
            } else {
              Emoji.deleteOne({ _id }).then((res) => {
                ctx.body = {
                  cussess: true,
                };
              });
            }
          },
        );
        return;
      }
      if (!_id) {
        // new emoji
        const saveSrc = await saveImg2Bucket(code, dataUrl, fileType);
        new Emoji({
          code,
          src: saveSrc,
        }).save();
        ctx.body = { success: true };
      } else {
        // update emoji
        const upgradeCfg = { code };
        if (dataUrl) {
          upgradeCfg.src = await saveImg2Bucket(code, dataUrl, fileType);
        }
        await Emoji.updateOne({ _id }, { $set: { ...upgradeCfg } });
        ctx.body = { success: true, src: saveSrc };
      }
    } catch (error) {
      console.log('error', error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function saveImg2Bucket(code, dataUrl, fileType) {
  const bf = Buffer.from(
    dataUrl.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );
  const fileInfo = `${code}.${fileType}`.toLowerCase();
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: `${BUCKET_NAME}/${fileInfo}`,
        Body: bf,
      },
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(`http://sinacloud.net/ada.bucket/${BUCKET_NAME}/${fileInfo}`);
        }
      },
    );
  });
}

routerExports.getEmojis = {
  method: 'get',
  url: '/getEmojis',
  route: async (ctx) => {
    try {
      const emojis = (await Emoji.find()) || [];
      ctx.body = {
        success: true,
        emojis,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

module.exports = routerExports;
