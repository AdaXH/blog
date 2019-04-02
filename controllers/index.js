const mongoose = require('mongoose')
const moodSchema = require('../dbmodel/Mood')
const Message = require('../dbmodel/Message')
const Article = require('../dbmodel/Article')
const Dynamic = require('../dbmodel/Dynamic')
const Customer = require('../dbmodel/Customer')
const Mood = require('../dbmodel/Mood')

const routerExports = {}

routerExports.getCustomer = {
    method: 'get',
    url: '/get-customer',
    route: async (ctx, next) => {
        try {
            const data = await callGetCustomer()
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

function callGetCustomer() {
    return new Promise((resolve, reject) => {
        Customer.findOne({}).then(data => {
            data ? resolve(data)
                :
                reject('网络出错')
        }).catch(err =>
            reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
    })
}

routerExports.addCustomer = {
    method: 'post',
    url: '/add-customer',
    route: async (ctx, next) => {
        const { number } = ctx.request.body
        try {
            const customer = await Customer.findOne({})
            if (customer.number)
             await Customer.updateOne({}, { $set: { number: customer.number + 1 } })
            ctx.body = true
        } catch (error) {
            ctx.body = false            
        }
    }
}

function moodArr(time) {
    return new Promise((resolve, reject) => {
        // console.log('pc: ' + new Date())
        console.log('native: ' + time)
        Mood.find({}, (err, res) => {
            err ? reject([]) : resolve(res)
        })
    })
}

function articleArr() {
    return new Promise((resolve, reject) => {
        Article.find({}, (err, res) => {
            const result = res.sort((a, b) => {
                return (new Date((b.year + '-' + b.date)).getTime()) - (new Date((a.year + '-' + a.date)).getTime())
            })
            err ? reject([]) : resolve(result)
        })
    })
}

function timeago(dateTimeStamp) {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    const minute = 1000 * 60       //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const halfamonth = day * 15
    const month = day * 30
    const now = new Date().getTime()    //获取当前时间毫秒
    const diffValue = now - dateTimeStamp //时间差

    if (diffValue < 0) {
        return
    }
    const minC = diffValue / minute   //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour
    const dayC = diffValue / day
    const weekC = diffValue / week
    const monthC = diffValue / month
    if (monthC >= 1 && monthC <= 3) {
        result = " " + parseInt(monthC) + "月前"
    } else if (weekC >= 1 && weekC <= 3) {
        result = " " + parseInt(weekC) + "周前"
    } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + "天前"
    } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + "小时前"
    } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚"
    } else {
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
function dynamicArr() {
    return new Promise((resolve, reject) => {
        Dynamic.find({}, (err, res) => {
            err ? reject([]) : resolve(res.reverse())
        })
    })
}

function messageArr() {
    return new Promise((resolve, reject) => {
        Message.find({}, (err, res) => {
            err ? reject([]) : resolve(res)
            let rebuildMsg = []
            for (let item of res)
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
///<h2>+\w{1,}<\/h2>/.exec('aaa11111<h2>title</h2>
routerExports.getArticles = {
    method: 'get',
    url: '/getArticles',
    route: async (ctx, next) => {
        try {
            const article = await articleArr()
            ctx.body = {
                success: true,
                data: article
            }
        } catch (error) {
            ctx.body = {
                success: false,
                errorMsg: error
            }
        }
    }
}


function reMapArticle(result) {
    for (let item of result) {
        // const title = /<h2>+\w{1,} +| [\u4e00-\u9fa5]{1,}<\/h2>/.exec(item.summary)
        const value = item.summary.replace(/[0-9]+|[a-z]+|[A-Z]+|<+|>/g, '')
        item.title = value.slice(0, 5) || ''
    }
    return result
}

routerExports.getAllMessages = {
    method: 'get',
    url: '/getAllMessages',
    route: async (ctx, nect) => {
        try {
            const result = await Message.find({})
            const _result = result.sort((a, b) => {
                const time1 = new Date(a.date.replace(/-----/g, ' ').replace(/ : /g, ':')).getTime()
                const time2 = new Date(b.date.replace(/-----/g, ' ').replace(/ : /g, ':')).getTime()
                return time2 - time1
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
            ctx.body = {
                success: true,
                data: _result
            }
        } catch (err) {
            console.log(err)
            ctx.body = {
                success: false,
                errorMsg: err
            }
        }
    }
}

routerExports.routerIndex = {
    method: 'get',
    url: '/*',
    route: async (ctx, next) => {
        const userAgent = /Mobile+|iPhone+|Android/.test(ctx.request.header['user-agent']) ? 'Mobile' : 'pc'
        const { request: { url } } = ctx
        const date = new Date()
        const time = `${url|| ''} : ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号 : ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`
        
        // Mobile
        if (userAgent === 'Mobile') {
                console.log('Mobile: ' + time)
                await ctx.render('mobile')
            }
        
        
        else if(/native/.test(url)){
            console.log('Native:  ' + time )
            if (userAgent === 'pc') { // native-version
                try {
                    const mood = await moodArr(time)
                    const article = await articleArr()
                    const message = await messageArr()
                    const dynamic = await dynamicArr()
                    const dynamicTemp = dynamic.map(item => {
                        let result = {}
                        if (item._doc)
                            result = {
                                ...item._doc,
                                img: !!item._doc.img ? item._doc.img.replace(/jpeg/g, 'jpg') : ''
                            }
                        else result = {
                            ...item,
                            img: !!item.img ? item.img.replace(/jpeg/g, 'jpg') : ''
                        }
                        return result
                    })
                    const dynamicSort = dynamicTemp.sort((b, a) => {
                        return new Date(a.date).getTime() - new Date(b.date).getTime()
                    })
                    await ctx.render('native', {
                        title: 'Ada - 个人主页',
                        mood,
                        article,
                        message: message.reverse(),
                        dynamic: dynamicTemp
                    })
                } catch (error) {
                    console.log(error)
                    await ctx.render('native', {
                        title: 'Ada - 个人主页',
                        mood: [],
                        article: [],
                        message: [],
                        dynamic: []
                    })
                }
            }
        }
        // Dva
        else{
            console.log('dva:    ' + time)
            await ctx.render('dva')
        }

    }
}

module.exports = routerExports 
