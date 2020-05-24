const Message = require('../dbmodel/Message')
const Article = require('../dbmodel/Article')
const Dynamic = require('../dbmodel/Dynamic')
const Customer = require('../dbmodel/Customer')
const Mood = require('../dbmodel/Mood')
const User = require('../dbmodel/User')
const {
	timeago,
} = require('../common/util')

const routerExports = {}

routerExports.getCustomer = {
    method: 'get',
    url: '/get-customer',
    route: async (ctx, next) => {
        try {
            const data = await callGetCustomer()
            const userAgent = /Mobile+|iPhone+|Android/.test(ctx.request.header['user-agent']) ? 'Mobile' : 'pc'
            const { request: { url, header } } = ctx
            const date = new Date()
            //${date.getFullYear()}年
            console.log('\n')
            const time = `${date.getMonth() + 1}月${date.getDate()}号 ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`
            console.log(`客户端: ${header['user-agent'] || ''}`)
            if (userAgent === 'Mobile') {
                console.log('Mobile: ' + time)
            }
            else if (/native/.test(url)) {
                console.log('Native: ' + time)
            }
            else {
                console.log('dva: ' + time)
            }
            ctx.body = {
                success: true,
                data
            }
        } catch (error) {
            ctx.body = {
                success: true,
                errorMsg: error,
                data: {}
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

function setAvatar(name) {
    return new Promise(resolve => {
        User.findOne({ name }).then(result => {
            if (result) resolve(result.avatar || '')
            else resolve('')
        })
    })
}

routerExports.getAllMessages = {
    method: 'get',
    url: '/getAllMessages',
    route: async (ctx, nect) => {
        try {
            const result = await Message.find({})
            async function setAllAvatar(result) {
                for (let item of result) {
                    const avatar = await setAvatar(item.name)
                    item.avatar = avatar
                }
                return result
            }
            const msgWithAvatar = await setAllAvatar(result)
            for (let item of msgWithAvatar)
                if (item.repeat && item.repeat.length !== 0) {
                    for (let item2 of item.repeat) {
                        if (item2 && item2 !== null) {
                            let temp = new Date(item2.date).getTime()
                            item2.date = timeago(temp)
                        }
                    }
                }
            const _result = msgWithAvatar.sort((a, b) => {
                const time1 = new Date(a.date.replace(/-----/g, ' ').replace(/ : /g, ':')).getTime()
                const time2 = new Date(b.date.replace(/-----/g, ' ').replace(/ : /g, ':')).getTime()
                return time2 - time1
            })
            ctx.body = {
                success: true,
                data: msgWithAvatar
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
        const time = `${url || ''} : ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号 : ${date.getHours()}点${date.getMinutes()}分${date.getSeconds()}秒`

        // Mobile
        if (userAgent === 'Mobile') {
            await ctx.render('mobile')
        }

        else if (/twui/.test(url)) {
            console.log('twui: ', time)
            await ctx.render('twui')
        }

        else if (/native/.test(url)) {
            // console.log('Native:  ' + time)
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
        else {
            // console.log('dva:    ' + time)
            await ctx.render('dva')
        }

    }
}

module.exports = routerExports 
