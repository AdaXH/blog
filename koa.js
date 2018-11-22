const koa = require('koa') 
const app = new koa() 
const bodyparser = require('koa-bodyparser') 
const json = require('koa-json')
const views = require('koa-views')
const mongoose = require('mongoose') 
const fs = require('fs')
const router = require('koa-router')()
// console.log('1')
const files = fs.readdirSync(__dirname + '/controllers')

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
    "jsonLimit": '5mb',
    "formLimit": '5mb',
    "textLimit": '5mb'
}))
// console.log('2')
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))
// console.log('3')
//controllers
const controllers = files.filter(item => item.endsWith('.js') )
for (let controller of controllers) {
    const  controllersExport = require(__dirname + '/controllers/' + controller) || undefined
    if (!controllersExport || !(controllersExport instanceof Object)) 
        console.log(controller + '没有提供正确的接口')
    else
        for (let key in controllersExport){
            if(!controllersExport[key].method || !controllersExport[key].url || !controllersExport[key].route)
                console.log(controller + ' 的 "' + key + '" 配置不正确')
            else
                router[controllersExport[key].method](controllersExport[key].url, controllersExport[key].route)
        }
}
// console.log('4')
//router
app.use(router.routes(), router.allowedMethods())
// console.log('5')
app.listen(5050, _ => console.log('server on 5050'))


const env = 'dev'
//connect to mongo
//mongodb://root:jTPgd5nT8uSdzDRr0sgazdnwan1dB2gMwcQvslUU@koeabpwkfrbs.mongodb.sae.sina.com.cn:10297,zcubkoddktjc.mongodb.sae.sina.com.cn:10297
env !== 'dev' ?
mongoose.connect('mongodb://root:jTPgd5nT8uSdzDRr0sgazdnwan1dB2gMwcQvslUU@koeabpwkfrbs.mongodb.sae.sina.com.cn:10297').then(res=> {
    res ?
    	console.log('connected to mongo') 
    :
    	console.log('can not connect to mongo') 
}) 
// console.log('6')
:
mongoose.connect('mongodb://localhost:27017/graduation', { useNewUrlParser: true }).then(res => {
    res ?
    	console.log('connected to mongo') 
    :
    	console.log('can not connect to mongo') 
}) 
