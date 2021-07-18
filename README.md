![screenshot](http://bucker-for-sae.oss-cn-hangzhou.aliyuncs.com/siteImagesBucket/e7f6c2c8-4331-4854-ad35-066bfac50a7a1619168848477.png)

## 简介
“基于react为前端，mongdb为持久层，node为服务端的个人博客系统，<a href="https://www.adaxh.site">预览</a>”

### 本地体验：安装依赖

```ruby
   $ npm i
```

在启动前，需要打开数据库连接

### config :

```js
   module.exports = {
     development: {
       host: 'mongodb://localhost:27017/blog',
     },
     production: {
       host: '对应线上数据库的链接地址',
     },
     port: 5050,
   };
```
### 相关script
```ruby
    npm run dev // 只打开服务端
    npm run dev-pc // 打开服务端和pc端
    npm run dev-mobile // 打开服务端和移动端
    npm run build-pc // 生成pc打包文件
    
    node admin // 生成默认账号，admin，密码admin123
```


### 如何部署到服务器
1. node环境的服务器
2. 准备mogodb数据库
3. 配置数据库url(buddle-server/serverConfig.js)、云存储bucket(buddle-server/bucketConfig.js)相关accessKey和secret
4. npm run start

### 注意：

1. 后端代码是三年前写的，现在只上传了 buddle 版本，不维护了。
