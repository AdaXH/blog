# Project-Blog

## 安装依赖

```ruby
   $ npm i
```

在启动前，需要打开数据库连接

## config :

```ruby
    mongoose.connect('mongodb://localhost:27017/blog').then(res=> {
    res ?
        console.log('connect to mongo')
    :
        console.log('can not connect to mongo'+err)
});
```

```ruby
    npm run dev // 只打开服务端
    npm run dev-pc // 打开服务端和pc端
    npm run dev-mobile // 打开服务端和移动端
    npm run build-pc // 生成pc打包文件
```

URL https://www.adaxh.site

![screenshot](http://wx3.sinaimg.cn/mw690/a99a6e98ly1fzhr333xfaj21fn0u01kx.jpg)
![screenshot](http://wx1.sinaimg.cn/mw690/a99a6e98ly1fzhr2ziflpj21jb0u07wh.jpg)
