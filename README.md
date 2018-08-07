# Project-Blog

## install modules
```ruby  
   $ npm i
```
to install all modules the project need,
The project's data should got from local mongodb,
you should config that in app.js:

## prepare data with mongo

```ruby
    mongoose.connect('mongodb://localhost:27017/blog').then(res=> {
    if (res) 
        console.log('connect to mongo');
    else
        console.log('can not connect to mongo'+err);
});
```
## you should create the flow collections before running :
```ruby
const dynamicSchema = mongoose.Schema({
    title: String,
    content: String,
    date: String,
    upvote: Number,
    msg:Array({
      context : String,
      date : String
    })
})  //collection's name 'dynamics'
```
```ruby
const articleSchema = mongoose.Schema({
	date:String,
	year:String,
	title:String,
	summary:String
});  //collection's name 'articles'
```
```ruby
const messageSchema = mongoose.Schema({
	name:String,
	content:String,
	date:String
}); //collection's name 'messages'
```
```ruby
const moodSchema = mongoose.Schema({
	date:String,
	mood:String,
	user:String
}) //collection's name 'moods'
```ruby
const userSchema = mongoose.Schema({
	name:String,
	password:String
}); // collection's name 'users' , **the admin's account must be 'Ada' or some operation won't work !**  
```

review at https://adaxh.applinzi.com
 
![screenshot](http://wx2.sinaimg.cn/mw690/a99a6e98ly1fox9b9l44ij20sg0lc457.jpg)  
