const Message = require('./../dbmodel/Message')
const User = require('./../dbmodel/User')
const { getJWTPayload, timeago, reMapError } = require('../common/util')
const routerExports = {}

function escapeMessage(str) {
  if (!str) return ''
  else return str.replace(/<\/?script>/g, '')
}

routerExports.deleteInnerRepeat = {
  method: 'post',
  url: '/deleteInnerRepeat',
  route: async (ctx, next) => {
    const { _id, _parent_id } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      const user = await User.findOne({ _id: payload._id })
      if (!user) throw '当前用户不存在或会话已过期'
      const result = await deleteInnerRepeat(_id, _parent_id, user.name)
      ctx.body = {
        success: true,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

function setAvatar(name) {
  return new Promise((resolve) => {
    User.findOne({ name }).then((result) => {
      if (result) resolve(result.avatar || '')
      else resolve('')
    })
  })
}

routerExports.getMessageByPageSize = {
  method: 'post',
  url: '/getMessageByPageSize',
  route: async (ctx) => {
    const { pageSize, index } = ctx.request.body
    try {
      const result = await callGetMessageByPageSize(pageSize)
      const temp = [...result].reverse()
      const data = {
        data: temp.slice(index, pageSize),
      }
      async function setAllAvatar(result) {
        for (let item of result) {
          const avatar = await setAvatar(item.name)
          item.avatar = avatar
        }
        return result
      }
      const msgWithAvatar = await setAllAvatar(data.data)
      ctx.body = {
        success: true,
        data: msgWithAvatar,
        total: result.length,
        isOver: result.length <= pageSize,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

function callGetMessageByPageSize() {
  return new Promise((resolve, reject) => {
    Message.find({}, (err, res) => {
      err ? reject([]) : resolve(res)
      let rebuildMsg = []
      const _result = res.sort((a, b) => {
        const time1 = new Date(
          a.date.replace(/-----/g, ' ').replace(/ : /g, ':')
        ).getTime()
        const time2 = new Date(
          b.date.replace(/-----/g, ' ').replace(/ : /g, ':')
        ).getTime()
        return time1 - time2
      })
      for (let item of _result)
        if (item.repeat && item.repeat.length !== 0) {
          for (let item2 of item.repeat) {
            if (item2 && item2 !== null) {
              let temp = new Date(item2.date).getTime()
              item2.date = timeago(temp)
            }
          }
        }
    })
  })
}

function deleteInnerRepeat(_id, _parent_id, name) {
  return new Promise((resolve, reject) => {
    Message.findOne({ _id: _parent_id })
      .then((ans) => {
        if (!ans) reject('该条回复已不存在')
        else {
          const repeat = ans.repeat.filter((item) => item._id != _id)
          const na = ans.repeat.filter((item) => item._id == _id)[0].name
          User.findOne({ name })
            .then((ans) => {
              if (!ans) reject('当前用户不存在')
              else {
                if (name === na || ans.admin)
                  Message.updateOne(
                    { _id: _parent_id },
                    {
                      $set: {
                        repeat: [...repeat],
                      },
                    }
                  ).then((res) =>
                    res.ok === 1 ? resolve(true) : reject('删除失败')
                  )
                else if (name !== na) reject('只能删除自己的回复')
              }
            })
            .catch((err) =>
              reject(
                reject(
                  err instanceof Object ? JSON.stringify(err) : err.toString()
                )
              )
            )
        }
      })
      .catch((err) =>
        reject(
          reject(err instanceof Object ? JSON.stringify(err) : err.toString())
        )
      )
  })
}

routerExports._repeatMsg = {
  method: 'post',
  url: '/repeatmsg',
  route: async (ctx) => {
    const { _id, toRepeat, info } = ctx.request.body
    let date = new Date()
    let minute = date.getMinutes()
    const m = minute < 10 ? minute + 1 : '0' + minute
    let seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    let year = date.getFullYear()
    let month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    let d =
      year + '/' + month + '/' + day + ' ' + hour + ':' + m + ':' + seconds
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      const user = await User.findOne({ _id: payload._id })
      if (!user) throw '当前用户不存在'
      if (user.name === toRepeat) throw '请勿回复自己'
      const msg = {
        toRepeat,
        date: d,
        info,
        name: user.name,
      }
      const currentMsg = await Message.findOne({ _id })
      await Message.updateOne(
        { _id },
        { $set: { repeat: [...currentMsg.repeat, msg] } }
      )
      const data = await Message.find({})
      let result = []
      if (data) {
        for (let item of data) {
          if (item.repeat && item.repeat.length !== 0)
            for (let repeat of item.repeat) {
              let temp = new Date(repeat.date).getTime()
              repeat.date = timeago(temp)
            }
        }
        result = data.sort((a, b) => {
          const time1 = new Date(
            a.date.replace(/-----/g, ' ').replace(/ : /g, ':')
          ).getTime()
          const time2 = new Date(
            b.date.replace(/-----/g, ' ').replace(/ : /g, ':')
          ).getTime()
          return time1 - time2
        })
      }

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

routerExports.repeatMsg = {
  //将废弃
  method: 'post',
  url: '/repeatMsg',
  route: async (ctx, next) => {
    const { _id, msg } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      const data = await callRepeatMsg(_id, msg)
      ctx.body = {
        success: true,
        data,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}
//
function callRepeatMsg(_id, msg) {
  return new Promise((resolve, reject) => {
    Message.findOne({ _id })
      .then((ans) => {
        if (!ans) reject('这条留言已不存在，无法回复')
        else {
          const repeat = ans.repeat || []
          Message.updateMany(
            { _id },
            {
              $set: {
                repeat: [...repeat, msg],
              },
            }
          )
            .then((res) => {
              if (res.ok === 1) {
                Message.find({})
                  .then((ans) => {
                    if (ans) {
                      for (let item of ans)
                        if (item.repeat && item.repeat.length !== 0) {
                          for (let item2 of item.repeat) {
                            let temp = new Date(item2.date).getTime()
                            item2.date = timeago(temp)
                          }
                        }
                      resolve(ans)
                    } else reject('获取留言板失败')
                  })
                  .catch((err) => reject('回复成功，但是获取失败'))
              } else reject('回复失败')
            })
            .catch((err) =>
              reject(
                '回复失败' + err instanceof Object
                  ? JSON.stringify(err)
                  : err.toString()
              )
            )
        }
      })
      .catch((err) =>
        reject(
          reject(
            '无法回复' + err instanceof Object
              ? JSON.stringify(err)
              : err.toString()
          )
        )
      )
  })
}

routerExports.deleteMsg = {
  method: 'post',
  url: '/deleteMsgById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      const currentMsg = await Message.findOne({ _id })
      const user = await User.findOne({ _id: payload._id })
      if (!user) throw '会话已过期'
      if (currentMsg.name === user.name || user.admin) {
        await Message.deleteOne({ _id })
        ctx.body = {
          success: true,
        }
      } else throw '暂无权限'
    } catch (err) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports._leaveMsg = {
  method: 'post',
  url: '/leaveMsg',
  route: async (ctx) => {
    const { date, content } = ctx.request.body
    const newContent = escapeMessage(content)
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      if (!date || !content) throw '入参错误'
      const user = await User.findOne({ _id: payload._id })
      const data = await new Message({
        name: user.name,
        date,
        content: newContent,
        repeat: [],
      }).save()
      ctx.body = {
        success: true,
        data,
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: reMapError(error),
      }
    }
  },
}

routerExports.leaveMsg = {
  //新版本废弃
  method: 'post',
  url: '/leaveMessage',
  route: async (ctx, next) => {
    const { date, content } = ctx.request.body
    const newContent = escapeMessage(content)
    try {
      const payload = getJWTPayload(ctx.headers.authorization)
      if (!payload) throw 'token认证失败'
      const user = await User.findOne({ _id: payload._id })
      if (!date || !content) throw '入参错误'
      const data = await callLeaveMessage(user.name, date, newContent)
      ctx.body = {
        success: true,
        data,
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

function callLeaveMessage(name, date, content) {
  return new Promise((resolve, reject) => {
    new Message({
      name,
      date,
      content,
      repeat: [],
    }).save((err, ans) => {
      console.log(ans)
      if (err)
        reject(
          '留言保存失败' + err instanceof Object
            ? JSON.stringify(err)
            : err.toString()
        )
      else {
        Message.find({}, (err, ans) => {
          if (err)
            reject(
              '获取留言失败' + err instanceof Object
                ? JSON.stringify(err)
                : err.toString()
            )
          else {
            for (let item of ans)
              if (item.repeat && item.repeat.length !== 0) {
                for (let item2 of item.repeat) {
                  let temp = new Date(item2.date).getTime()
                  item2.date = timeago(temp)
                }
              }
            resolve(ans)
          }
        })
      }
    })
  })
}

module.exports = routerExports
