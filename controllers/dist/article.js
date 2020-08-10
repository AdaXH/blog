"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,r){if(e){if("string"==typeof e)return _arrayLikeToArray(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(e,r):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function ownKeys(r,e){var t,n=Object.keys(r);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(r),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),n.push.apply(n,t)),n}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){_defineProperty(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function asyncGeneratorStep(e,r,t,n,a,s,o){try{var c=e[s](o),i=c.value}catch(e){return void t(e)}c.done?r(i):Promise.resolve(i).then(n,a)}function _asyncToGenerator(c){return function(){var e=this,o=arguments;return new Promise(function(r,t){var n=c.apply(e,o);function a(e){asyncGeneratorStep(n,r,t,a,s,"next",e)}function s(e){asyncGeneratorStep(n,r,t,a,s,"throw",e)}a(void 0)})}}function _asyncIterator(e){var r;if("undefined"!=typeof Symbol){if(Symbol.asyncIterator&&null!=(r=e[Symbol.asyncIterator]))return r.call(e);if(Symbol.iterator&&null!=(r=e[Symbol.iterator]))return r.call(e)}throw new TypeError("Object is not async iterable")}var Article=require("./../dbmodel/Article"),User=require("./../dbmodel/User"),_require=require("../common/util"),parseToken=_require.parseToken,reMapError=_require.reMapError,sendEmail=_require.sendEmail,_require2=require("../common/apiPrefix"),setAllAvatar=_require2.setAllAvatar,routerExports={};routerExports.deleteArticle={method:"post",url:"/deleteArticle",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Article.findByIdAndDelete({_id:n});case 4:if(null===e.sent)throw"删除失败，文章已不存在";e.next=7;break;case 7:r.body={success:!0},e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 13:case"end":return e.stop()}},e,null,[[1,10]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.queryArticleById={method:"post",url:"/queryArticleById",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,s,o,c,i,u,d;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Article.findOne({_id:n});case 4:return a=e.sent,s=a.message,e.next=8,setAllAvatar(s);case 8:o=e.sent,c=a.year,i=a.date,u=a.time,d=void 0===u?"0:0:0":u,/-/.test(i)&&(a.date=new Date("".concat(c,"-").concat(i,"/").concat(d))),r.body={success:!0,data:_objectSpread(_objectSpread({},a._doc),{},{message:o.reverse()})},e.next=18;break;case 14:e.prev=14,e.t0=e.catch(1),console.log("error",e.t0),r.body={success:!1,errorMsg:reMapError(e.t0)};case 18:case"end":return e.stop()}},e,null,[[1,14]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.saveArticle={method:"post",url:"/saveArticle",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,s,o,c,i,u,d;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,a=n.date,s=n.year,o=n.summary,c=n.type,i=n.time,u=n.title,d=void 0===u?"title":u,e.prev=1,e.next=4,new Article({time:i,date:a,year:s,summary:o,type:c,viewer:0,title:d}).save();case 4:if(e.sent._id){e.next=7;break}throw"保存失败";case 7:r.body={success:!0},e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 13:case"end":return e.stop()}},e,null,[[1,10]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.updateArticle={method:"post",url:"/updateArticleViewerById",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Article.findOne({_id:n});case 4:if(a=e.sent){e.next=7;break}throw"文章不存在";case 7:return e.next=9,Article.updateOne({_id:n},{$set:{viewer:a.viewer+1}});case 9:r.body={success:!0},e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 15:case"end":return e.stop()}},e,null,[[1,12]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.updateArticleById={method:"post",url:"/updateArticleById",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,s,o,c,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,a=n._id,s=n.summary,o=n.title,c=void 0===o?"":o,i=n.type,e.prev=1,e.next=4,Article.updateOne({_id:a},{$set:{summary:s,type:i,title:c}});case 4:r.body={success:!0},e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 10:case"end":return e.stop()}},e,null,[[1,7]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.deleteArticleMsg={method:"post",url:"/deleteArticleMsg",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,s,o,c,i,u,d,l;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,a=n.articleId,s=n.messageId,o=n.userId,e.prev=1,c=r.headers.authorization,i=parseToken(c),u=i._id,e.next=6,User.findById(u);case 6:if(e.sent.admin||o===u){e.next=9;break}throw"无权限删除";case 9:return e.next=11,Article.findById(a);case 11:return d=e.sent,l=d.message||[],e.next=15,Article.updateOne({_id:a},{$set:{message:l.filter(function(e){return e._id!=s})}});case 15:r.body={success:!0},e.next=21;break;case 18:e.prev=18,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 21:case"end":return e.stop()}},e,null,[[1,18]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.deleteArticleReplyMsg={method:"post",url:"/deleteArticleReplyMsg",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,s,o,c,i,u,d,l,p,y,f,m,b,v,x,h;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,a=n.articleId,s=n.messageId,o=n.userId,c=n.repeatId,e.prev=1,i=r.headers.authorization,u=parseToken(i),d=u._id,e.next=6,User.findById(d);case 6:if(e.sent.admin||o===d){e.next=9;break}throw"无权限删除";case 9:return e.next=11,Article.findById(a,{message:1});case 11:l=e.sent,p=l._doc.message||[],f=!(y=!0),e.prev=15,b=_asyncIterator(p);case 17:return e.next=19,b.next();case 19:return v=e.sent,y=v.done,e.next=23,v.value;case 23:if(x=e.sent,y){e.next=32;break}if((h=x)._id==s)return h.repeat=h.repeat.filter(function(e){return e._id!=c}),e.abrupt("break",32);e.next=29;break;case 29:y=!0,e.next=17;break;case 32:e.next=38;break;case 34:e.prev=34,e.t0=e.catch(15),f=!0,m=e.t0;case 38:if(e.prev=38,e.prev=39,y||null==b.return){e.next=43;break}return e.next=43,b.return();case 43:if(e.prev=43,f)throw m;e.next=46;break;case 46:return e.finish(43);case 47:return e.finish(38);case 48:return e.next=50,Article.updateOne({_id:a},{$set:{message:_toConsumableArray(p)}});case 50:r.body={success:!0},e.next=56;break;case 53:e.prev=53,e.t1=e.catch(1),r.body={success:!1,errorMsg:e.t1};case 56:case"end":return e.stop()}},e,null,[[1,53],[15,34,38,48],[39,,43,47]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.discussArticle={method:"post",url:"/discussArticle",route:function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n,a,s,o,c,i,u,d,l,p,y,f,m;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=r.request.body,n=t.msg,a=t.date,s=void 0===a?Date.now():a,o=t.articleId,c=t.quickReply,e.prev=1,i=r.headers.authorization,u={},c||(u=parseToken(i)),d=u._id,c||u._id){e.next=8;break}throw"登录过期，请重新登陆";case 8:return e.next=10,Article.findById(o,{message:1,title:1});case 10:if(l=e.sent){e.next=13;break}throw"文章已不存在";case 13:return p=l.message,y=c?{name:"陌生人",avatar:"/upload/user_avatar/default_avatar.jpg"}:{},d&&(y.userId=d),e.next=19,Article.updateOne({_id:o},{$set:{message:[].concat(_toConsumableArray(p),[_objectSpread({msg:n,date:s,quickReply:c},y)])}});case 19:return e.next=21,Article.findById(o,{message:1});case 21:return f=e.sent,e.next=24,setAllAvatar(f.message.reverse());case 24:return f.message=e.sent,e.next=27,User.findById(d,{name:1,email:1});case 27:if(e.t0=e.sent,e.t0){e.next=30;break}e.t0={};case 30:m=e.t0,sendEmail("hi，Ada，文章《".concat(l.title,"》评论中有了新的评论～\n\n          ").concat(m.name||"陌生人","（").concat(m.eamil||"email","） 说 ：\n\n          “").concat(n,"” \n\n          详情(pc)：https://adaxh.site/article-detail?id=").concat(o,"\n        "),"18668465750@163.com","文章新评论通知"),r.body={success:!0,data:f},e.next=39;break;case 35:e.prev=35,e.t1=e.catch(1),console.log("error",e.t1),r.body={success:!1,errorMsg:e.t1};case 39:case"end":return e.stop()}},e,null,[[1,35]])}));return function(e){return r.apply(this,arguments)}}()},routerExports.replyArticleMsg={method:"post",url:"/replyArticleMsg",route:function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n,a,s,o,c,i,u,d,l,p,y,f,m,b,v,x,h,g,_,A,k,w,I;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.request.body,n=t.msg,a=t.date,s=void 0===a?Date.now():a,o=t.toRepeatUserId,c=t.articleId,i=t.messageId,e.prev=1,u=r.headers.authorization,d=parseToken(u),l=d._id,e.next=6,Article.findById(c,{message:1,title:1});case 6:if(p=e.sent){e.next=9;break}throw"文章已不存在";case 9:y=p.message,m=!(f=!0),e.prev=12,v=_asyncIterator(y);case 14:return e.next=16,v.next();case 16:return x=e.sent,f=x.done,e.next=20,x.value;case 20:if(h=e.sent,f){e.next=32;break}if(_=(g=h)._id,A=g.repeat,_==i)return g.repeat=[].concat(_toConsumableArray(A),[{msg:n,date:s,toRepeatUserId:o,userId:l}]),e.next=28,Article.updateOne({_id:c},{$set:{message:_toConsumableArray(y)}});e.next=29;break;case 28:return e.abrupt("break",32);case 29:f=!0,e.next=14;break;case 32:e.next=38;break;case 34:e.prev=34,e.t0=e.catch(12),m=!0,b=e.t0;case 38:if(e.prev=38,e.prev=39,f||null==v.return){e.next=43;break}return e.next=43,v.return();case 43:if(e.prev=43,m)throw b;e.next=46;break;case 46:return e.finish(43);case 47:return e.finish(38);case 48:return e.next=50,Article.findById(c,{message:1}).sort({_id:-1});case 50:return k=e.sent,e.next=53,setAllAvatar(k.message.reverse());case 53:return k.message=e.sent,e.next=56,User.findById(o);case 56:return w=e.sent,e.next=59,User.findById(l);case 59:I=e.sent,w&&w.email&&sendEmail("hi，".concat(w.name,"，你在https://adaxh.site 的文章《").concat(p.title,"》评论中有了新的回复～\n\n          ").concat(I.name," 说 ：\n\n          “").concat(n,"” \n\n          详情(pc)：https://adaxh.site/article-detail?id=").concat(c,"\n        "),w.email,"文章评论回复通知"),r.body={success:!0,data:k},e.next=68;break;case 64:e.prev=64,e.t1=e.catch(1),console.log("error",e.t1),r.body={success:!1,errorMsg:e.t1};case 68:case"end":return e.stop()}},e,null,[[1,64],[12,34,38,48],[39,,43,47]])}));return function(e){return r.apply(this,arguments)}}()},module.exports=routerExports;