const Dynamic = require('./../dbmodel/Dynamic')
const User = require('./../dbmodel/User')
const Base64 = require('js-base64').Base64
const Customer = require('../dbmodel/Customer')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const routerExports = {}

/* 通过token获取JWT的payload部分 */
function getJWTPayload(token) {
  // 验证并解析JWT
  if (!token) return
  return jwt.verify(token, 'secret');
}

routerExports.upvote = {
  method: 'post',
  url: '/upvoteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const currentDyanmic = await Dynamic.findOne({ _id })
      await Dynamic.updateOne({ _id }, { $set: { upvote: currentDyanmic.upvote + 1 } })
      ctx.body = { success: true }
    } catch (error) {
      console.log(error)
      ctx.body = { success: false }
    }
  }
}

routerExports.cancelUpvote = {
  method: 'post',
  url: '/cancelUpvote',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const currentDyanmic = await Dynamic.findOne({ _id })
      await Dynamic.updateOne({ _id }, { $set: { upvote: currentDyanmic.upvote > 1 ? currentDyanmic.upvote - 1 : 1 } })
      ctx.body = { success: true }
    } catch (error) {
      console.log(error)
      ctx.body = { success: false }
    }
  }
}

routerExports.getDynamic = {
  method: 'get',
  url: '/getDynamic',
  route: async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    try {
      const result = await callGetDynamic()
      const temp = [...result].reverse().map(item => {
        let _result = {}
        if (item._doc)
          _result = {
            ...item._doc,
            img: !!item._doc.img ? item._doc.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif') : ''
          }
        else _result = {
          ...item,
          img: !!item.img ? item.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif') : ''
        }
        return _result
      })
      const customer = await Customer.findOne({})
      if (customer.number)
        await Customer.updateOne({}, { $set: { number: customer.number + 1 } })
      ctx.body = {
        success: true,
        data: temp
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error
      }
    }
  }
}

routerExports.setDynamicImg = {
  method: 'post',
  url: '/setDynamicImg',
  route: async ctx => {
    const { name, dataUrl } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      else {
        const { _id } = payload
        const user = await User.findOne({ _id })
        if (!user.admin)
          throw '当前用户无权限'
      }
      const img = await callSetDynamicImg(name, dataUrl)
      ctx.body = {
        success: true,
        img
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        success: false,
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

function callSetDynamicImg(name, dataUrl) {
  return new Promise((resolve, reject) => {
    const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    fs.writeFile(`./public/upload/dynamic_img/${name.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif')}`, bf, err => {
      err === null ?
        resolve(`upload/dynamic_img/${name.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif')}`)
        :
        reject('保存文件时出错' + err instanceof Object ? JSON.stringify(err) : err.toString())
    })
  })
}

routerExports.getDynamicByPageSize = {
  method: 'post',
  url: '/getDynamicByPageSize',
  route: async ctx => {
    const { pageSize, index } = ctx.request.body
    try {
      const result = await callGetDynamic(pageSize)
      const temp = [...result].reverse().map(item => {
        let result = {}
        if (item._doc)
          result = {
            ...item._doc,
            img: !!item._doc.img ? item._doc.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif') : ''
          }
        else result = {
          ...item,
          img: !!item.img ? item.img.replace(/jpeg+|JPG/g, 'jpg').replace(/GIF/g, 'gif') : ''
        }
        return result
      })
      const data = {
        data: temp.slice(index, pageSize)
      }
      ctx.body = {
        success: true,
        data: data.data,
        isOver: result.length <= pageSize,
        total: result.length
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error
      }
    }
  }
}

function callGetDynamic(pageSize, index) {
  return new Promise((resolve, reject) => {
    Dynamic.find({}).then(res => {
      res ? resolve(sortArr(res)) : reject('无法获取dynamic数据')
    }).catch(err => reject(err.toString()))
  })
}

function sortArr(res) {
  return res.sort((a, b) => {
    return (new Date(a.date).getTime()) - (new Date(b.date).getTime())
  })
}

function callUpvote(_id, upvote) {
  return new Promise((resolve, reject) => {
    Dynamic.updateMany({ _id }, { $set: { upvote } }).then(res => {
      res.ok === 0 ? reject(false) : resolve(true)
    }).catch(err => reject(false))
  })
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
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

routerExports.leaveMsg = { // 新版本废弃
  method: 'post',
  url: '/leave-dynamic-mg',
  route: async (ctx, next) => {
    const { _id, msg, name } = ctx.request.body
    try {
      // await next()
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      if (!_id || !msg || !name) throw '入参错误'
      const result = await callLeaveMsgDynamic(_id, msg, name)
      ctx.body = {
        success: true,
        data: result,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

function callLeaveMsgDynamic(_id, msg, name) {
  return new Promise((resolve, reject) => {
    Dynamic.findOne({ _id }).then(data => {
      if (data) {
        const oldMsg = data.msg
        const newMsg = oldMsg.concat([{ ...msg, name: Base64.decode(name) }])
        Dynamic.updateMany({ _id }, { $set: { msg: newMsg } }).then(res => {
          Dynamic.find({}).then(ans => {
            resolve(ans)
          }).catch(err => reject('更新成功，但是获取失败了'))
        }).catch(err => {
          reject('更新失败' + err instanceof Object ? JSON.stringify(err) : err.toString)
        })
      } else
        reject('这条动态已不存在')
    })
  })
}

routerExports.deleDynamic = {
  method: 'post',
  url: '/deleteDynamic',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      else {
        const user = await User.findOne({ _id: payload._id })
        if (!user.admin)
          throw '当前用户无权限'
        const deleteRes = await Dynamic.deleteOne({ _id })
        if (deleteRes.ok !== 1) 
          throw '删除失败'
      }
      ctx.body = {
        success: true,
        ...payload
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

function callDeleteDynamicById(_id) { // 废弃
  return new Promise((resolve, reject) => {
    Dynamic.deleteOne({ _id }, err => {
      if (err) reject('删除失败' + err instanceof Object ? JSON.stringify(err) : err.toString())
      else {
        Dynamic.find({}, (err, result) => {
          result && resolve(result)
        })
      }
    })
  })
}

routerExports.addDynamic = {
  method: 'post',
  url: '/addDynamic',
  route: async (ctx, next) => {
    const { title, content, upvote, date, img } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      else {
        const { _id } = payload
        const user = await User.findOne({ _id })
        if (!!user && !user.admin)
          throw '当前用户无权限'
      }
      const result = await callAddDynamic(title, content, upvote, date, img)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

function callAddDynamic(title, content, upvote, date, img) {
  return new Promise((resolve, reject) => {
    new Dynamic({
      title, content, date, upvote, img
    }).save().then(res => {
      if (res) {
        Dynamic.find({}).then(res => {
          res ? resolve(res) : reject('发布成功，但是获取失败了')
        }).catch(err => reject('发布成功，但是获取失败了'))
      } else reject('发布失败')
    }).catch(err => reject('发布失败' + err instanceof Object ? JSON.stringify(err) : err.toString()))
  })
}

routerExports.updateDynamic = {
  method: 'post',
  url: '/updateDynamic',
  route: async (ctx, next) => {
    const { _id, content, title, img } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      else {
        const { _id } = payload
        const user = await User.findOne({ _id })
        if (!user.admin)
          throw '当前用户无权限'
      }
      const result = await Dynamic.updateMany({ _id }, { $set: { content, title, img } })
      ctx.body = result.n !== 0
    } catch (error) {
      console.log(error)
      ctx.body = false
    }
  }
}

routerExports.queryDynamic = {
  method: 'post',
  url: '/dynamicQueryById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    await Dynamic.findOne({ _id }).then(data => {
      data ? ctx.body = { img: data.img, title: data.title, content: data.content, _id: data._id } : ctx.body = false
    }).catch(err => {
      ctx.body = false
    })
  }
}

routerExports.deleteDynamicMsg = {
  method: 'post',
  url: '/deleteDynamicMsg',
  route: async (ctx, next) => {
    const { _id, msgId } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      else {
        const { _id } = payload
        const user = await User.findOne({ _id })
        if (!!user && !user.admin)
          throw '当前用户无权限'
      }
      await callDeleteDynamicMsg(_id, msgId)
      ctx.body = { success: true }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
      }
    }
  }
}

function callDeleteDynamicMsg(_id, msgId) {
  return new Promise((resolve, reject) => {
    Dynamic.findOne({ _id: msgId }).then(data => {
      if (data) {
        const msg = data.msg.filter(item => (String(item._id) !== String(_id)))
        Dynamic.updateOne({ _id: msgId }, {
          $set: {
            msg
          }
        }).then(ans => ans.ok === 1 ? resolve(true) : reject('删除失败'))
      }
    }).catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
  })
}

module.exports = routerExports 
