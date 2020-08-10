"use strict";function _objectWithoutProperties(e,r){if(null==e)return{};var t,n=_objectWithoutPropertiesLoose(e,r);if(Object.getOwnPropertySymbols)for(var o=Object.getOwnPropertySymbols(e),a=0;a<o.length;a++)t=o[a],0<=r.indexOf(t)||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t]);return n}function _objectWithoutPropertiesLoose(e,r){if(null==e)return{};for(var t,n={},o=Object.keys(e),a=0;a<o.length;a++)t=o[a],0<=r.indexOf(t)||(n[t]=e[t]);return n}function _slicedToArray(e,r){return _arrayWithHoles(e)||_iterableToArrayLimit(e,r)||_unsupportedIterableToArray(e,r)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(e,r){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],n=!0,o=!1,a=void 0;try{for(var c,u=e[Symbol.iterator]();!(n=(c=u.next()).done)&&(t.push(c.value),!r||t.length!==r);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==u.return||u.return()}finally{if(o)throw a}}return t}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function ownKeys(r,e){var t,n=Object.keys(r);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(r),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),n.push.apply(n,t)),n}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){_defineProperty(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,r){if(e){if("string"==typeof e)return _arrayLikeToArray(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(e,r):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function asyncGeneratorStep(e,r,t,n,o,a,c){try{var u=e[a](c),i=u.value}catch(e){return void t(e)}u.done?r(i):Promise.resolve(i).then(n,o)}function _asyncToGenerator(u){return function(){var e=this,c=arguments;return new Promise(function(r,t){var n=u.apply(e,c);function o(e){asyncGeneratorStep(n,r,t,o,a,"next",e)}function a(e){asyncGeneratorStep(n,r,t,o,a,"throw",e)}o(void 0)})}}var Dynamic=require("./../dbmodel/Dynamic"),User=require("./../dbmodel/User"),Base64=require("js-base64").Base64,Customer=require("../dbmodel/Customer"),SinaCloud=require("scs-sdk"),accessKey=require("../bucketConfig").accessKey,_require=require("../common/util"),parseToken=_require.parseToken,getJWTPayload=_require.getJWTPayload,reMapError=_require.reMapError,routerExports={};function callSetDynamicImgToBucket(o,e){var r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"",a=Buffer(e.replace(/^data:image\/\w+;base64,/,""),"base64"),c=new SinaCloud.S3;return new Promise(function(t,n){var e;/ada.bucket/.test(r)&&(e=_slicedToArray(r.replace("http://sinacloud.net/ada.bucket/","").split("?KID"),1)[0],c.deleteObject({Bucket:"ada.bucket",Key:e},function(e){e&&n("")})),c.putObject({ACL:"public-read",Bucket:"ada.bucket",Key:"dynamic_img/".concat(o.replace(/jpeg+|JPG/g,"jpg").replace(/GIF/g,"gif")),Body:a},function(e,r){e?n(e):t("http://sinacloud.net/ada.bucket/dynamic_img/".concat(o.replace(/jpeg+|JPG/g,"jpg").replace(/GIF/g,"gif")).concat(accessKey))})})}function callDeleteDynamicMsg(o,a){return new Promise(function(t,n){Dynamic.findOne({_id:a}).then(function(e){var r;e&&(r=e.msg.filter(function(e){return String(e._id)!==String(o)}),Dynamic.updateOne({_id:a},{$set:{msg:r}}).then(function(e){return 1===e.ok?t(!0):n("删除失败")}))}).catch(function(e){return n(e instanceof Object?JSON.stringify(e):e.toString())})})}routerExports.upvote={method:"post",url:"/upvoteDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Dynamic.findOne({_id:n});case 4:return o=e.sent,e.next=7,Dynamic.updateOne({_id:n},{$set:{upvote:(o.upvote||0)+1}});case 7:r.body={success:!0},e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 13:case"end":return e.stop()}},e,null,[[1,10]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.cancelUpvote={method:"post",url:"/cancelUpvote",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Dynamic.findOne({_id:n});case 4:return o=e.sent,e.next=7,Dynamic.updateOne({_id:n},{$set:{upvote:1<o.upvote?o.upvote-1:1}});case 7:r.body={success:!0},e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 13:case"end":return e.stop()}},e,null,[[1,10]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.getDynamic={method:"get",url:"/getDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Dynamic.find();case 3:return n=e.sent,o=_toConsumableArray(n).reverse().map(function(e){return e._doc?_objectSpread(_objectSpread({},e._doc),{},{img:e._doc.img?e._doc.img.replace(/jpeg+|JPG/g,"jpg").replace(/GIF/g,"gif"):""}):_objectSpread(_objectSpread({},e),{},{img:e.img?e.img.replace(/jpeg+|JPG/g,"jpg").replace(/GIF/g,"gif"):""})}),e.next=7,Customer.findOne({});case 7:if((a=e.sent)&&a.number)return e.next=11,Customer.updateOne({},{$set:{number:a.number+1}});e.next=11;break;case 11:r.body={success:!0,data:o.sort(function(e,r){return new Date(r.date).getTime()-new Date(e.date).getTime()})},e.next=17;break;case 14:e.prev=14,e.t0=e.catch(0),r.body={success:!1,errorMsg:e.t0};case 17:case"end":return e.stop()}},e,null,[[0,14]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.setDynamicImg={method:"post",url:"/setDynamicImg",route:function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){var t,n,o,a,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.request.body,n=t.name,o=t.dataUrl,a=t.img,e.prev=1,e.next=4,callSetDynamicImgToBucket(n,o,a);case 4:c=e.sent,r.body={success:!0,img:c},e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 11:case"end":return e.stop()}},e,null,[[1,8]])}));return function(e){return r.apply(this,arguments)}}()},routerExports.discussDynamic={method:"post",url:"/discussDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o,a,c,u,i,s,p,d,y;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.request.body,o=n._id,a=n.msg,c=n.name,e.prev=1,u=getJWTPayload(r.headers.authorization)){e.next=5;break}throw"token认证失败";case 5:if(o&&a&&c){e.next=7;break}throw"入参错误";case 7:return e.next=9,Dynamic.findOne({_id:o});case 9:return i=e.sent,e.next=12,User.findOne({_id:u._id});case 12:return s=e.sent,p=i.msg,d=p.concat([_objectSpread(_objectSpread({},a),{},{name:s.name})]),e.next=17,Dynamic.updateOne({_id:o},{$set:{msg:d}});case 17:return e.next=19,Dynamic.findById(o);case 19:y=e.sent,r.body={success:!0,data:y},e.next=26;break;case 23:e.prev=23,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 26:case"end":return e.stop()}},e,null,[[1,23]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.deleDynamic={method:"post",url:"/deleteDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.prev=1,e.next=4,Dynamic.deleteOne({_id:n});case 4:r.body={success:!0},e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 10:case"end":return e.stop()}},e,null,[[1,7]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.addDynamic={method:"post",url:"/addDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o,a,c,u,i,s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,o=n.title,a=n.content,c=n.upvote,u=n.date,i=n.img,e.prev=1,e.next=4,new Dynamic({title:o,content:a,upvote:c,date:u,img:i}).save();case 4:return e.next=6,Dynamic.find();case 6:s=e.sent,r.body={success:!0,data:s},e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 13:case"end":return e.stop()}},e,null,[[1,10]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.updateDynamic={method:"post",url:"/updateDynamic",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o,a,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,e.prev=1,o=n._id,a=_objectWithoutProperties(n,["_id"]),e.next=5,Dynamic.updateOne({_id:o},{$set:a});case 5:c=e.sent,r.body=0!==c.n,e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),r.body=!1;case 12:case"end":return e.stop()}},e,null,[[1,9]])}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.queryDynamic={method:"post",url:"/dynamicQueryById",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body._id,e.next=3,Dynamic.findOne({_id:n}).then(function(e){r.body=!!e&&{img:e.img,title:e.title,content:e.content,_id:e._id}}).catch(function(e){r.body=!1});case 3:case"end":return e.stop()}},e)}));return function(e,r){return t.apply(this,arguments)}}()},routerExports.deleteDynamicMsg={method:"post",url:"/deleteDynamicMsg",route:function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(r,t){var n,o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.request.body,o=n._id,a=n.msgId,e.prev=1,e.next=4,callDeleteDynamicMsg(o,a);case 4:r.body={success:!0},e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),r.body={success:!1,errorMsg:e.t0};case 10:case"end":return e.stop()}},e,null,[[1,7]])}));return function(e,r){return t.apply(this,arguments)}}()},module.exports=routerExports;