const Message = require('./../dbmodel/Message') 
const User = require('./../dbmodel/User')
const routerExports = { }

function escapeMessage(str){
    if(!str) return '' 
    else    return str.replace(/<\/?script>/g,'') 
}

routerExports.deleteInnerRepeat = {
    method: 'post',
    url: '/deleteInnerRepeat',
    route: async(ctx, next) => {
        const { _id, _parent_id, name } = ctx.request.body
        try {
            const result = await deleteInnerRepeat(_id, _parent_id, name)
            ctx.body = {
                success: true
            }
        } catch (error) {
            ctx.body = {
                success: false,
                errorMsg: error
            }
        }
    }
}

function deleteInnerRepeat(_id, _parent_id, name){
    return new Promise((resolve, reject) => {
       Message.findOne({ _id: _parent_id }).then(ans => {
           if(!ans) reject('该条回复已不存在')
           else{
               const repeat = ans.repeat.filter(item => item._id != _id )
               const na = ans.repeat.filter(item => item._id == _id)[0].name
               User.findOne({ name }).then(ans => {
                   console.log(ans)
                   if(!ans) reject('当前用户不存在')
                   else{
                       if(name === na || ans.admin)
                           Message.updateOne({ _id: _parent_id }, {
                               $set: {
                                      repeat: [...repeat]
                               }
                           }).then(res => res.ok === 1 ? resolve(true) : reject('删除失败'))
                       else if (name !== na) reject('只能删除自己的回复')
                   }
               })
            .catch(err => reject(reject(err instanceof Object ? JSON.stringify(err) : err.toString())))
           }
       }).catch(err => reject(reject(err instanceof Object ? JSON.stringify(err) : err.toString())))
    })
}

routerExports.repeatMsg = {
    method: 'post',
    url: '/repeatMsg',
    route: async (ctx, next) => {
        const { _id, msg } = ctx.request.body
        try {
            const data = await callRepeatMsg(_id, msg)
            ctx.body = {
                success: true,
                data
            }
        } catch (error) {
            ctx.body = {
                success: false,
                errorMsg: error
            }
        }
    }
}
//
function callRepeatMsg(_id, msg){
    return new Promise((resolve, reject) => {
        Message.findOne({ _id }).then(ans => {
            if(!ans) reject('这条留言已不存在，无法回复')
            else{
                const repeat = ans.repeat || []
                Message.update({ _id }, {
                    $set: {
                        repeat: [ ...repeat, msg ]
                    }
                }).then(res => {
                    if(res.ok === 1){
                        Message.find({}).then(ans => {
                            if(ans) {
                                for (let item of ans)
                                    if (item.repeat && item.repeat.length !== 0) {
                                        for (let item2 of item.repeat) {
                                            let temp = new Date(item2.date).getTime()
                                            item2.date = timeago(temp)
                                        }
                                    } 
                                resolve(ans)
                            } 
                            else
                            reject('获取留言板失败')
                        } )
                        .catch(err => reject( '回复成功，但是获取失败' ))
                    }else reject('回复失败')
                    }).catch(err => reject('回复失败' + err instanceof Object ? JSON.stringify(err) : err.toString() ) )
            }
        }).catch(err => reject(reject('无法回复' + err instanceof Object ? JSON.stringify(err) : err.toString())))
    })
}

routerExports.deleteMsg = { 
    method: 'post',
    url: '/deleteMsgById',
    route: async (ctx, next) => {
        const { _id } = ctx.request.body
        await Message.remove({ _id }).then(data => {
            data.ok === 0 ? ctx.body = {
                success: false,
                errorMsg: '该留言已不存在'
            } : ctx.body = {
                success: true
            }
        })
    }
}

routerExports.leaveMsg = {
    method: 'post',
    url: '/leaveMessage',
    route: async (ctx, next) => {
        const { name, date, content } = ctx.request.body
        const newContent = escapeMessage(content)
        try {
            const data = await callLeaveMessage(name, date, newContent)
            ctx.body = {
                success: true,
                data
            }
        } catch (error) {
            ctx.body = {
                success: false,
                errorMsg: error
            }
        }
    }
 }

function callLeaveMessage(name, date, content) {
    return new Promise((resolve, reject) => {
        new Message({
            name, date, content, repeat: []
        }).save((err, ans) => {
            if (err) reject('留言保存失败' + err instanceof Object ? JSON.stringify(err) : err.toString())
            else {
                Message.find({}, (err, ans) => {
                    if (err) reject('获取留言失败' + err instanceof Object ? JSON.stringify(err) : err.toString()) 
                    else{
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

function timeago(dateTimeStamp){   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
     const minute = 1000 * 60       //把分，时，天，周，半个月，一个月用毫秒表示
     const hour = minute * 60 
     const day = hour * 24 
     const week = day * 7 
     const halfamonth = day * 15 
     const month = day * 30 
     const now = new Date().getTime()    //获取当前时间毫秒
     const diffValue = now - dateTimeStamp //时间差
 
    if(diffValue < 0){
        return 
    }
     const minC = diffValue/minute   //计算时间差的分，时，天，周，月
     const hourC = diffValue/hour 
     const dayC = diffValue/day 
     const weekC = diffValue/week 
     const monthC = diffValue/month 
    if(monthC >= 1 && monthC <= 3){
        result = " " + parseInt(monthC) + "月前"
    }else if(weekC >= 1 && weekC <= 3){
        result = " " + parseInt(weekC) + "周前"
    }else if(dayC >= 1 && dayC <= 6){
        result = " " + parseInt(dayC) + "天前"
    }else if(hourC >= 1 && hourC <= 23){
        result = " " + parseInt(hourC) + "小时前"
    }else if(minC >= 1 && minC <= 59){
        result =" " + parseInt(minC) + "分钟前"
    }else if(diffValue >= 0 && diffValue <= minute){
        result = "刚刚"
    }else {
         const datetime = new Date() 
        datetime.setTime(dateTimeStamp) 
         const Nyear = datetime.getFullYear() 
         const Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1 
         const Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate() 
         const Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours() 
         const Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes() 
         const Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds() 
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result 
}

module.exports = routerExports  