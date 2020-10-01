const SinaCloud = require('scs-sdk');

// 全局生效:
SinaCloud.config = new SinaCloud.Config({
  accessKeyId: '1b24azces6uiVWvMDbnN',
  secretAccessKey: '59769489567c92ab6d05026ec8322c4c503c17f2',
  sslEnabled: false,
});

function callUploadBucket(fileBuffer) {
  return new Promise((resolve, reject) => {
    const s3 = new SinaCloud.S3();
    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: 'test.jpg',
        Body: fileBuffer,
      },
      function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve('uploaded');
        }
      },
    );
  });
}

const routerExports = {};

routerExports.uploadBucket = {
  method: 'post',
  url: '/uploadBucket',
  route: async (ctx) => {
    const { binary } = JSON.parse(ctx.request.body);
    try {
      // const payload = getJWTPayload(ctx.headers.authorization)
      // if (!payload) throw 'token认证失败'
      // else {
      // 	const { _id } = payload
      // 	const user = await User.findOne({ _id })
      // 	if (!user.admin)
      // 		throw '当前用户无权限'
      // }
      // await callDeleteArticleById(_id)
      // var file = await require('fs').readFileSync('F:\/CODE\/adaxh\/public/111.jpg');
      const bf = Buffer.from(
        binary.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      await callUploadBucket(bf);
      // console.log(file)

      ctx.body = {
        success: true,
        // result
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
