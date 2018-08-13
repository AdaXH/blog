const koa = require('koa') 
const app = new koa() 
const bodyparser = require('koa-bodyparser') 
const json = require('koa-json')
const views = require('koa-views')
const mongoose = require('mongoose') 
const fs = require('fs')
const router = require('koa-router')()

const files = fs.readdirSync(__dirname + '/controllers')

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
    "jsonLimit": '5mb',
    "formLimit": '5mb',
    "textLimit": '5mb'
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

//controllers
const controllers = files.filter(item => item.endsWith('.js') )
for (let controller of controllers) {
    const  controllersExport = require(__dirname + '/controllers/' + controller) || undefined
    if (!controllersExport || !(controllersExport instanceof Object)) 
        console.log(controller + '没有提供正确的接口')
    else
    for (let key in controllersExport){
        if (!controllersExport[key].method || !controllersExport[key].url || !controllersExport[key].route)
            console.log(file + '的' + key + '配置不正确')
        else
        router[controllersExport[key].method](controllersExport[key].url, controllersExport[key].route)
    }
}
//router
app.use(router.routes(), router.allowedMethods())

app.listen(5050, (err, ans) => {
    if (err)
        console.log(err) 
    else
 		console.log('server on 5050') 
})

//connect to mongo
mongoose.connect('mongodb://root:5sKYwhI2Ss6QYLGT0fTCoIghteD13JrZFBVxDJYD@zaokkidcvkmn.mongodb.sae.sina.com.cn:10441').then(res=> {
    if (res)
    	console.log('connect to mongo') 
    else
    	console.log('can not connect to mongo') 
}) 
// mongoose.connect('mongodb://localhost:27017/graduation', { useNewUrlParser: true }).then(res => {
//     if (res)
//     	console.log('connect to mongo') 
//     else
//     	console.log('can not connect to mongo') 
// }) 
