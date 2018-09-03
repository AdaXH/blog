# Project-Blog

## install modules
```ruby  
   $ npm i
```
to install all modules the project need,
The project's data should get from local mongodb,
you should config that in koa.js:

## config :

```ruby
    mongoose.connect('mongodb://localhost:27017/blog').then(res=> {
    res ?
        console.log('connect to mongo')
    :
        console.log('can not connect to mongo'+err)
});
```
## you should create the following collections or run 'mongorestore' in the 'dump' floder before running :
```ruby
module.exports = mongoose.model('dynamics', mongoose.Schema({
    title: String,
    content: String,
    date: String,
    upvote: Number,
    msg: Array({
        context: String,
        date: String
    })
}))
```
```ruby
module.exports = mongoose.model('articles', mongoose.Schema({
    date: String,
    year: String,
    type: String,
    summary: String,
    time: String,
    viewer: {
        default: 0,
        type: Number
    }
}))
```
```ruby
module.exports = mongoose.model('messages', mongoose.Schema({
    name: String,
    content: String,
    date: String,
    repeat: Array({
        info: String,
        date: String,
        name: String
    })
}))
```
```ruby
module.exports = mongoose.model('moods', mongoose.Schema({
	date: String,
	mood: String,
	user: String
}))
```
```ruby
module.exports = mongoose.model('users', mongoose.Schema({
    name:String,
    password:String,
    admin: {
        type: Bollean,
        default: false
    },
    avatar: {
    	type: String,
	default: '/upload/user_avatar/default_avatar.jpg'
    }
})) //  **the admin's name must be 'Ada' or some operation won't be work !**  
```

URL  https://adaxh.applinzi.com
 
![screenshot](http://wx2.sinaimg.cn/mw690/a99a6e98ly1fox9b9l44ij20sg0lc457.jpg)  
