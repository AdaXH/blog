const Dynamic = require('./../dbmodel/Dynamic') 

const routerExports = {}

routerExports.upvote = {
  method: 'post',
  url: '/upvoteDynamic',
  route: async (ctx, next) => {
    const { _id, upvote } = ctx.request.body
    try {
      await callUpvote(_id, upvote)
      ctx.body = { success: true }
    } catch (error) {
      ctx.body = { success: false }
    }
  }
} 

function callUpvote(_id, upvote){
  return new Promise((resolve, reject) => {
    Dynamic.update({_id }, { $set: { upvote } }).then(res => {
      res.ok === 0 ? reject(false) : resolve(true)
    }).catch(err => reject(false) )
  })
}

routerExports.leaveMsg = {
  method: 'post',
  url: '/leave-dynamic-mg',
  route: async (ctx, next) => {
    const { _id, msg } = ctx.request.body
    try {
      const result = await callLeaveMsgDynamic(_id, msg)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error
      }
    }
  }
}

function callLeaveMsgDynamic(_id, msg){
  return new Promise((resolve, reject) => {
    Dynamic.findOne({ _id }).then(data => {
      if(data){
        const oldMsg = data.msg
        const newMsg = oldMsg.concat(msg)
        Dynamic.update({ _id }, { $set: { msg: newMsg } }).then(res => {
            Dynamic.find({}).then(ans => {
              resolve(ans)
            }).catch(err => reject('更新成功，但是获取失败了') )
        }).catch(err => {
          reject('更新失败' + err instanceof Object ? JSON.stringify(err) : err.toString)
        })
      }else 
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
      const result = await callDeleteDynamicById(_id)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error
      }
    }
  }
}

function callDeleteDynamicById(_id){
  return new Promise((resolve, reject) => {
    Dynamic.remove({ _id }, err => {
      if (err) reject('删除失败' + err instanceof Object ? JSON.stringify(err) : err.toString())
        else{
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
    const { title, content, upvote, date } = ctx.request.body
    try {
      const result = await callAddDynamic(title, content, upvote, date)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error
      }
    }
  }
} 

function callAddDynamic(title, content, upvote, date) {
  return new Promise((resolve, reject) => {
    new Dynamic({
      title, content, date, upvote
    }).save().then(res => {
      if(res){
        Dynamic.find({}).then(res => {
          res ? resolve(res) : reject('发布成功，但是获取失败了') 
        }).catch(err => reject('发布成功，但是获取失败了') )
      }else reject('发布失败')
      }).catch(err => reject('发布失败' + err instanceof Object ? JSON.stringify(err) : err.toString()))
  })
}

routerExports.updateDynamic = { 
  method: 'post',
  url: '/updateDynamic',
  route: async (ctx, next) => {
    const { _id, content, title } = ctx.request.body

    await Dynamic.update({ _id }, { $set: { content, title } }).then(data => {
      data.n === 0 ? ctx.body = false : ctx.body = true
    }).catch(err => {
      ctx.body = false
    })
  }
}

routerExports.queryDynamic = {
    method: 'post',
    url: '/dynamicQueryById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body
    await Dynamic.findOne({ _id }).then(data => {
      data ? ctx.body = { title: data.title, content: data.content, _id: data._id } : ctx.body = false
    }).catch(err => {
      ctx.body = false
    })
  }
 }
module.exports =  routerExports 
