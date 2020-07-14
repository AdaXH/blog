const Dynamic = require('./../dbmodel/Dynamic')
const User = require('./../dbmodel/User')
const Base64 = require('js-base64').Base64
const Customer = require('../dbmodel/Customer')
const SinaCloud = require('scs-sdk')
const accessKey = require('../bucketConfig').accessKey
const { parseToken, getJWTPayload, reMapError } = require('../common/util')

const routerExports = {}

routerExports.upvote = {
  method: 'post',
  url: '/upvoteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const currentDyanmic = await Dynamic.findOne({ _id })
      await Dynamic.updateOne(
        { _id },
        { $set: { upvote: (currentDyanmic.upvote || 0) + 1 } }
      )
      ctx.body = { success: true }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.cancelUpvote = {
  method: 'post',
  url: '/cancelUpvote',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const currentDyanmic = await Dynamic.findOne({ _id })
      await Dynamic.updateOne(
        { _id },
        {
          $set: {
            upvote: currentDyanmic.upvote > 1 ? currentDyanmic.upvote - 1 : 1,
          },
        }
      )
      ctx.body = { success: true }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.getDynamic = {
  method: 'get',
  url: '/getDynamic',
  route: async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    try {
      // const result = await callGetDynamic()
      const result = await Dynamic.find()
      const temp = [...result].reverse().map((item) => {
        let _result = {}
        if (item._doc)
          _result = {
            ...item._doc,
            img: !!item._doc.img
              ? item._doc.img
                  .replace(/jpeg+|JPG/g, 'jpg')
                  .replace(/GIF/g, 'gif')
              : '',
          }
        else
          _result = {
            ...item,
            img: !!item.img
              ? item.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif')
              : '',
          }
        return _result
      })
      const customer = await Customer.findOne({})
      if (customer && customer.number)
        await Customer.updateOne({}, { $set: { number: customer.number + 1 } })
      ctx.body = {
        success: true,
        data: temp.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.setDynamicImg = {
  method: 'post',
  url: '/setDynamicImg',
  route: async (ctx) => {
    const { name, dataUrl } = ctx.request.body
    try {
      const {
        headers: { authorization },
      } = ctx
      const tokenParse = parseToken(authorization)
      const { _id: userId } = tokenParse
      const user = await User.findOne({ _id: userId })
      if (!user.admin) throw '当前用户无权限'
      const img = await callSetDynamicImgToBucket(name, dataUrl)
      ctx.body = {
        success: true,
        img,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

function callSetDynamicImgToBucket(name, dataUrl) {
  const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  return new Promise((resolve, reject) => {
    const s3 = new SinaCloud.S3()
    s3.putObject(
      {
        ACL: 'public-read',
        Bucket: 'ada.bucket',
        Key: `dynamic_img/${name
          .replace(/jpeg+|JPG/g, 'jpg')
          .replace(/GIF/g, 'gif')}`,
        Body: bf,
      },
      function(error, response) {
        if (error) {
          reject(error)
        } else {
          resolve(
            `http://sinacloud.net/ada.bucket/dynamic_img/${name
              .replace(/jpeg+|JPG/g, 'jpg')
              .replace(/GIF/g, 'gif')}${accessKey}`
          )
        }
      }
    )
  })
}

routerExports.getDynamicByPageSize = {
  method: 'post',
  url: '/getDynamicByPageSize',
  route: async (ctx) => {
    const { pageSize, index } = ctx.request.body
    try {
      const result = await Dynamic.find()
      // const res = await Dynamic.find({}).skip((index * pageSize) - (pageSize)).limit(pageSize) 需要返回总数，取消该用法
      // console.log(res)
      const temp = [...result].reverse().map((item) => {
        let result = {}
        if (item._doc)
          result = {
            ...item._doc,
            img: !!item._doc.img
              ? item._doc.img
                  .replace(/jpeg+|JPG/g, 'jpg')
                  .replace(/GIF/g, 'gif')
              : '',
          }
        else
          result = {
            ...item,
            img: !!item.img
              ? item.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif')
              : '',
          }
        return result
      })
      const data = {
        data: temp.slice(index, pageSize),
      }
      ctx.body = {
        success: true,
        data: data.data,
        isOver: result.length <= pageSize,
        total: result.length,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.discussDynamic = {
  method: 'post',
  url: '/discussDynamic',
  route: async (ctx, next) => {
    const { _id, msg, name } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      if (!_id || !msg || !name) throw '入参错误'
      const currentDynamic = await Dynamic.findOne({ _id })
      const oldMsg = currentDynamic.msg
      const newMsg = oldMsg.concat([{ ...msg, name: Base64.decode(name) }])
      await Dynamic.updateOne({ _id }, { $set: { msg: newMsg } })
      const data = await Dynamic.findById(_id)
      ctx.body = {
        success: true,
        data: data,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.deleDynamic = {
  method: 'post',
  url: '/deleteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const {
        headers: { authorization },
      } = ctx
      const tokenParse = parseToken(authorization)
      const { _id: userId } = tokenParse
      const user = await User.findOne({ _id: userId })
      if (!user.admin) throw '当前用户无权限'
      const deleteRes = await Dynamic.deleteOne({ _id })
      if (deleteRes.ok !== 1) throw '删除失败'
      ctx.body = {
        success: true,
        ...payload,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.addDynamic = {
  method: 'post',
  url: '/addDynamic',
  route: async (ctx, next) => {
    const { title, content, upvote, date, img } = ctx.request.body
    try {
      const {
        headers: { authorization },
      } = ctx
      const tokenParse = parseToken(authorization)
      const { _id: userId } = tokenParse
      const user = await User.findOne({ _id: userId })
      if (!user.admin) throw '当前用户无权限'
      const saveResult = await new Dynamic({
        title,
        content,
        upvote,
        date,
        img,
      }).save()
      const result = await Dynamic.find()
      ctx.body = {
        success: true,
        data: result,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.updateDynamic = {
  method: 'post',
  url: '/updateDynamic',
  route: async (ctx, next) => {
    const { _id, content, title, img } = ctx.request.body
    try {
      const {
        headers: { authorization },
      } = ctx
      const tokenParse = parseToken(authorization)
      const { _id: userId } = tokenParse
      const user = await User.findOne({ _id: userId })
      if (!user.admin) throw '当前用户无权限'
      const result = await Dynamic.updateMany(
        { _id },
        { $set: { content, title, img } }
      )
      ctx.body = result.n !== 0
    } catch (error) {
      ctx.body = false
    }
  },
}

routerExports.queryDynamic = {
  method: 'post',
  url: '/dynamicQueryById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    await Dynamic.findOne({ _id })
      .then((data) => {
        data
          ? (ctx.body = {
              img: data.img,
              title: data.title,
              content: data.content,
              _id: data._id,
            })
          : (ctx.body = false)
      })
      .catch((err) => {
        ctx.body = false
      })
  },
}

routerExports.deleteDynamicMsg = {
  method: 'post',
  url: '/deleteDynamicMsg',
  route: async (ctx, next) => {
    const { _id, msgId } = ctx.request.body
    try {
      const {
        headers: { authorization },
      } = ctx
      const tokenParse = parseToken(authorization)
      const { _id: userId } = tokenParse
      const user = await User.findOne({ _id: userId })
      if (!user.admin) throw '当前用户无权限'
      await callDeleteDynamicMsg(_id, msgId)
      ctx.body = { success: true }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

function callDeleteDynamicMsg(_id, msgId) {
  return new Promise((resolve, reject) => {
    Dynamic.findOne({ _id: msgId })
      .then((data) => {
        if (data) {
          const msg = data.msg.filter(
            (item) => String(item._id) !== String(_id)
          )
          Dynamic.updateOne(
            { _id: msgId },
            {
              $set: {
                msg,
              },
            }
          ).then((ans) => (ans.ok === 1 ? resolve(true) : reject('删除失败')))
        }
      })
      .catch((err) =>
        reject(err instanceof Object ? JSON.stringify(err) : err.toString())
      )
  })
}

module.exports = routerExports
