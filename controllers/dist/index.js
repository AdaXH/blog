"use strict";function ownKeys(r,e){var t,n=Object.keys(r);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(r),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),n.push.apply(n,t)),n}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){_defineProperty(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _createForOfIteratorHelper(e,r){var t;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(t=_unsupportedIterableToArray(e))||r&&e&&"number"==typeof e.length){t&&(e=t);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,u=!0,c=!1;return{s:function(){t=e[Symbol.iterator]()},n:function(){var e=t.next();return u=e.done,e},e:function(e){c=!0,o=e},f:function(){try{u||null==t.return||t.return()}finally{if(c)throw o}}}}function _unsupportedIterableToArray(e,r){if(e){if("string"==typeof e)return _arrayLikeToArray(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(e,r):void 0}}function _arrayLikeToArray(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function asyncGeneratorStep(e,r,t,n,a,o,u){try{var c=e[o](u),s=c.value}catch(e){return void t(e)}c.done?r(s):Promise.resolve(s).then(n,a)}function _asyncToGenerator(c){return function(){var e=this,u=arguments;return new Promise(function(r,t){var n=c.apply(e,u);function a(e){asyncGeneratorStep(n,r,t,a,o,"next",e)}function o(e){asyncGeneratorStep(n,r,t,a,o,"throw",e)}a(void 0)})}}function _asyncIterator(e){var r;if("undefined"!=typeof Symbol){if(Symbol.asyncIterator&&null!=(r=e[Symbol.asyncIterator]))return r.call(e);if(Symbol.iterator&&null!=(r=e[Symbol.iterator]))return r.call(e)}throw new TypeError("Object is not async iterable")}var Message=require("../dbmodel/Message"),Article=require("../dbmodel/Article"),Dynamic=require("../dbmodel/Dynamic"),Customer=require("../dbmodel/Customer"),Mood=require("../dbmodel/Mood"),User=require("../dbmodel/User"),_require=require("../common/util"),timeago=_require.timeago,getJWTPayload=_require.getJWTPayload,_require2=require("../common/apiPrefix"),setAllAvatar=_require2.setAllAvatar,queryUser=_require2.queryUser,routerExports={};function callGetCustomer(){return new Promise(function(r,t){Customer.findOne({}).then(function(e){e?r(e):t("网络出错")}).catch(function(e){return t(e instanceof Object?JSON.stringify(e):e.toString())})})}function moodArr(e){return new Promise(function(t,n){console.log("native: "+e),Mood.find({},function(e,r){e?n([]):t(r)})})}function articleArr(){return new Promise(function(n,a){Article.find({},function(e,r){var t=r.sort(function(e,r){return new Date(r.year+"-"+r.date).getTime()-new Date(e.year+"-"+e.date).getTime()}).map(function(e){return delete e._doc.summary,e});e?a([]):n(t)})})}function dynamicArr(){return new Promise(function(t,n){Dynamic.find({},function(e,r){e?n([]):t(r.reverse())})})}function messageArr(){return new Promise(function(i,d){Message.find({},function(e,r){e?d([]):i(r);var t,n=_createForOfIteratorHelper(r);try{for(n.s();!(t=n.n()).done;){var a=t.value;if(a.repeat&&0!==a.repeat.length){var o,u=_createForOfIteratorHelper(a.repeat);try{for(u.s();!(o=u.n()).done;){var c,s=o.value;s&&null!==s&&(c=new Date(s.date).getTime(),s.date=timeago(c))}}catch(e){u.e(e)}finally{u.f()}}}}catch(e){n.e(e)}finally{n.f()}})})}routerExports.getCustomer={method:"get",url:"/get-customer",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,callGetCustomer();case 3:n=e.sent,r.body={success:!0,data:n},e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),r.body={success:!0,errorMsg:e.t0,data:{}};case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.addCustomer={method:"post",url:"/add-customer",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r.request.body.number,e.prev=1,e.next=4,Customer.findOne({});case 4:if((n=e.sent).number)return e.next=8,Customer.updateOne({},{$set:{number:n.number+1}});e.next=8;break;case 8:r.body=!0,e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),r.body=!1;case 14:case"end":return e.stop()}},e,null,[[1,11]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.getArticles={method:"get",url:"/getArticles",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Article.find({},{summary:0});case 3:n=e.sent,a=n.reverse().map(function(e){var r=e.year,t=e.date,n=e.time,a=void 0===n?"0:0:0":n;return/-/.test(t)&&(e.date=new Date("".concat(r,"-").concat(t,"/").concat(a))),e}),r.body={success:!0,data:a},e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),r.body={success:!1,errorMsg:e.t0};case 11:case"end":return e.stop()}},e,null,[[0,8]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.getAllMessages={method:"get",url:"/getAllMessages",route:function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r.body={success:!0},e.next=4,Message.find({}).sort({_id:-1});case 4:return t=e.sent,e.next=7,setAllAvatar(t);case 7:n=e.sent,r.body={success:!0,data:n},e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),r.body={success:!1,errorMsg:e.t0};case 14:case"end":return e.stop()}},e,null,[[0,11]])}));return function(e){return r.apply(this,arguments)}}()},routerExports.routerIndex={method:"get",url:"/*",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,a,o,u,c,s,i,d,l;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=/Mobile+|iPhone+|Android/.test(r.request.header["user-agent"])?"Mobile":"pc",a=r.request.url,o=new Date,u="".concat(a||""," : ").concat(o.getFullYear(),"年").concat(o.getMonth()+1,"月").concat(o.getDate(),"号 : ").concat(o.getHours(),"点").concat(o.getMinutes(),"分").concat(o.getSeconds(),"秒"),"Mobile"===n)return e.next=7,r.render("mobile");e.next=9;break;case 7:e.next=44;break;case 9:if(/twui/.test(a))return console.log("twui: ",u),e.next=13,r.render("twui");e.next=15;break;case 13:e.next=44;break;case 15:if(!/native/.test(a)){e.next=42;break}if("pc"===n)return e.prev=17,e.next=20,moodArr(u);e.next=40;break;case 20:return c=e.sent,e.next=23,articleArr();case 23:return s=e.sent,e.next=26,messageArr();case 26:return i=e.sent,e.next=29,dynamicArr();case 29:return d=e.sent,l=d.map(function(e){return e._doc?_objectSpread(_objectSpread({},e._doc),{},{img:e._doc.img?e._doc.img.replace(/jpeg/g,"jpg"):""}):_objectSpread(_objectSpread({},e),{},{img:e.img?e.img.replace(/jpeg/g,"jpg"):""})}),l.sort(function(e,r){return new Date(r.date).getTime()-new Date(e.date).getTime()}),e.next=34,r.render("native",{title:"Ada - 个人主页",mood:c,article:s,message:i.reverse(),dynamic:l});case 34:e.next=40;break;case 36:return e.prev=36,e.t0=e.catch(17),e.next=40,r.render("native",{title:"Ada - 个人主页",mood:[],article:[],message:[],dynamic:[]});case 40:e.next=44;break;case 42:return e.next=44,r.render("pc");case 44:case"end":return e.stop()}},e,null,[[17,36]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.superSU={method:"post",url:"/supersu",route:function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,t=getJWTPayload(r.headers.authorization)){e.next=4;break}throw"nndsnnds";case 4:return e.next=6,User.findOne({_id:t._id});case 6:if((n=e.sent)&&n.admin){e.next=9;break}throw"token error";case 9:return e.next=11,Message.find({});case 11:(a=e.sent).forEach(function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n,a,o,u,c,s,i,d,l,f,p,m,y,b,g,v,x;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.userId,n=r.name,a=r._id,o=r.repeat,e.next=3,queryUser({userId:t,name:n});case 3:if((u=e.sent).userId)return e.next=7,Message.updateOne({_id:a},{$set:_objectSpread({},u)});e.next=7;break;case 7:if(!o){e.next=55;break}c=[],i=!(s=!0),e.prev=11,l=_asyncIterator(o);case 13:return e.next=15,l.next();case 15:return f=e.sent,s=f.done,e.next=19,f.value;case 19:if(p=e.sent,s){e.next=37;break}return y=(m=p).toRepeatUser,m.userId,e.next=25,queryUser({userId:y.userId,name:m.toRepeat});case 25:return(b=e.sent).userId&&(m.toRepeatUser=_objectSpread(_objectSpread({},y),b)),e.next=29,queryUser({name:m.name});case 29:g=e.sent,v=g.userId,x=g.avatar,m.userId=v,m.avatar=x,c.push(m);case 34:s=!0,e.next=13;break;case 37:e.next=43;break;case 39:e.prev=39,e.t0=e.catch(11),i=!0,d=e.t0;case 43:if(e.prev=43,e.prev=44,s||null==l.return){e.next=48;break}return e.next=48,l.return();case 48:if(e.prev=48,i)throw d;e.next=51;break;case 51:return e.finish(48);case 52:return e.finish(43);case 53:return e.next=55,Message.updateOne({_id:a},{$set:{repeat:c}});case 55:case"end":return e.stop()}},e,null,[[11,39,43,53],[44,,48,52]])}));return function(e){return r.apply(this,arguments)}}()),r.body={success:!0,msgs:a},e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0),r.body={success:!1,errorMsg:e.t0};case 19:case"end":return e.stop()}},e,null,[[0,16]])}));return function(e){return r.apply(this,arguments)}}()},module.exports=routerExports;