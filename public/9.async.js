(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"/OQ8":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=E(a("xMca")),l=E(a("Os1Z")),r=E(a("bS4n")),u=E(a("cLjf")),s=E(a("hDQ3")),c=E(a("+XIM"));a("LAXG"),a("BLL0");var d=a("q+fq"),i=E(d),f=a("f23f"),o=a("HJ5N"),m=E(a("I1yq")),p=a("c/yQ"),v=E(a("3eY/")),g=E(a("eNQw"));function E(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t=e.data,a=e.articleId;if(!t)return null;var E,h,y=(0,d.useState)(t),I=(0,c.default)(y,2),b=I[0],N=I[1],w=(0,d.useState)(!1),M=(0,c.default)(w,2),_=M[0],k=M[1],x=(0,d.useState)(""),A=(0,c.default)(x,2),C=A[0],O=A[1],S=(0,o.useSetState)({visible:!1,msgInfo:{articleId:a},onOk:function(e){}}),q=(0,c.default)(S,2),P=q[0],T=q[1],L=(E=(0,s.default)(u.default.mark((function e(){var t;return u.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==C.trim()){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,p.discussArticle)({articleId:a,msg:C,quickReply:_});case 4:(t=e.sent).success&&(N(t.data.message),O(""));case 6:case"end":return e.stop()}}),e,void 0)}))),function(){return E.apply(this,arguments)}),Q=(h=(0,s.default)(u.default.mark((function e(t,n){return u.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,p.deleteArticleMsg)({articleId:a,messageId:t,userId:n});case 2:e.sent.success&&N(b.filter((function(e){return e._id!==t})));case 4:case"end":return e.stop()}}),e,void 0)}))),function(e,t){return h.apply(this,arguments)}),R=function(e,t){N(b.map((function(a){return a._id===e&&(a.repeat=a.repeat.filter((function(e){return e._id!==t}))),a})))},j=P.visible,D=P.msgInfo;return i.default.createElement("div",{className:v.default.msgContainer},i.default.createElement(m.default,{visible:j,msgInfo:D,onCancel:function(){return T({visible:!1})},setData:N}),i.default.createElement("h4",{className:v.default.title},"文章评论："),i.default.createElement("div",{className:v.default.newMsgContainer},i.default.createElement("textarea",{value:C,onChange:function(e){return O(e.target.value)}}),i.default.createElement(l.default,{disabled:""===C.trim(),className:v.default.submit,type:"danger",onClick:L},"提交"),i.default.createElement("span",{className:v.default.quickMsg},i.default.createElement(n.default,{value:_,onChange:function(e){return k(e.target.checked)}},"启用快捷评论（无需登录，但是回复不会有通知）")))," ",i.default.createElement("div",{className:v.default.msgList},i.default.createElement("div",null,"共",b.length,"条评论"),b.map((function(e){var t=e._id,n=e.msg,l=e.date,u=e.avatar,s=e.repeat,c=e.name,d=e.userId,o=e.quickReply;return i.default.createElement("div",{key:t},i.default.createElement("div",{className:v.default.msgItem},i.default.createElement("div",{className:v.default.msgTop},i.default.createElement("span",{className:v.default.avatar},i.default.createElement("img",{src:u,alt:"用户头像"})),i.default.createElement("span",{className:v.default.msgDate},o?"陌生人":c," - ",(0,f.formatTime)(l),"：",!o&&i.default.createElement(i.default.Fragment,null,i.default.createElement("a",{onClick:function(){return function(e,t,a){T({visible:!0,msgInfo:(0,r.default)({},D,{messageId:e,toRepeatUserId:t,name:a})})}(t,d,c)}},"[回复]")),i.default.createElement("a",{className:v.default.delete,onClick:function(){return Q(t,d)}},"[删除]"))),i.default.createElement("div",{className:v.default.msgText},n),i.default.createElement("div",{className:v.default.itemrepeat},i.default.createElement(g.default,{updateList:R,list:s,messageId:t,openModal:T,articleId:a}))))}))))}},I1yq:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=m(a("vRoj")),l=m(a("oomf")),r=m(a("cLjf")),u=m(a("bS4n")),s=m(a("hDQ3")),c=m(a("+XIM"));a("qgcB"),a("CH3h");var d=a("q+fq"),i=m(d),f=a("c/yQ"),o=m(a("3eY/"));function m(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t,a=e.visible,m=e.onCancel,p=e.msgInfo,v=e.setData,g=(0,d.useState)(""),E=(0,c.default)(g,2),h=E[0],y=E[1],I=(t=(0,s.default)(r.default.mark((function e(){var t,a;return r.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==h.trim()){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,f.replyArticleMsg)((0,u.default)({},p,{msg:h}));case 4:(t=e.sent).success&&(y(""),a=t.data.message,v(a.map((function(e){var t=e.repeat;return t&&(e.repeat=t),e}))),m());case 6:case"end":return e.stop()}}),e,void 0)}))),function(){return t.apply(this,arguments)});return i.default.createElement(n.default,{className:o.default.modal,closable:!1,visible:a,onOk:I,onCancel:m},i.default.createElement(l.default.TextArea,{placeholder:"回复"+p.name,autoSize:{maxRows:4,minRows:4},value:h,onChange:function(e){return y(e.target.value)}}))}},"c/yQ":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.replyArticleMsg=t.deleteArticleReplyMsg=t.deleteArticleMsg=t.discussArticle=void 0;var n,l,r,u,s=i(a("cLjf")),c=i(a("hDQ3")),d=(t.discussArticle=(n=(0,c.default)(s.default.mark((function e(t){return s.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,d.default)("api/discussArticle","POST",t));case 1:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)}),t.deleteArticleMsg=(l=(0,c.default)(s.default.mark((function e(t){return s.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,d.default)("api/deleteArticleMsg","POST",t));case 1:case"end":return e.stop()}}),e,this)}))),function(e){return l.apply(this,arguments)}),t.deleteArticleReplyMsg=(r=(0,c.default)(s.default.mark((function e(t){return s.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,d.default)("api/deleteArticleReplyMsg","POST",t));case 1:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)}),t.replyArticleMsg=(u=(0,c.default)(s.default.mark((function e(t){return s.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,d.default)("api/replyArticleMsg","POST",t));case 1:case"end":return e.stop()}}),e,this)}))),function(e){return u.apply(this,arguments)}),i(a("t3Un")));function i(e){return e&&e.__esModule?e:{default:e}}},eNQw:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=d(a("cLjf")),l=d(a("hDQ3")),r=d(a("q+fq")),u=a("f23f"),s=a("c/yQ"),c=d(a("3eY/"));function d(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t,a=e.list,d=e.messageId,i=e.articleId,f=e.updateList,o=e.openModal,m=(t=(0,l.default)(n.default.mark((function e(t,a){return n.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,s.deleteArticleReplyMsg)({repeatId:t,userId:a,messageId:d,articleId:i});case 2:e.sent.success&&f(d,t);case 4:case"end":return e.stop()}}),e,void 0)}))),function(e,a){return t.apply(this,arguments)});return r.default.createElement("div",{className:c.default.msgList+" "+c.default.msgRepeatList},a.map((function(e){var t=e._id,a=e.msg,n=e.date,l=e.avatar,s=e.name,f=e.userId,p=e.toRepeatUserVo,v=void 0===p?{}:p;return r.default.createElement("div",{key:t},r.default.createElement("div",{className:c.default.msgItem},r.default.createElement("div",{className:c.default.msgTop},r.default.createElement("span",{className:c.default.avatar},r.default.createElement("img",{src:l,alt:"用户头像"})),r.default.createElement("span",{className:c.default.msgDate},s," -",(0,u.formatTime)(n),s===v.name?null:"@ "+v.name,"：",r.default.createElement("a",{onClick:function(){return function(e,t,a){o({visible:!0,msgInfo:{articleId:i,messageId:e,toRepeatUserId:t,name:a}})}(d,f,v.name)}},"[回复]"),r.default.createElement("a",{className:c.default.delete,onClick:function(){return m(t,f)}},"[删除]"))),r.default.createElement("div",{className:c.default.msgText},a)))})))}},rIgM:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=g(a("cLjf")),l=g(a("hDQ3")),r=g(a("+XIM")),u=a("q+fq"),s=g(u),c=g(a("yPO/")),d=a("lwPf"),i=g(a("ZvZb")),f=a("f23f"),o=g(a("t3Un")),m=g(a("cPCf")),p=g(a("/OQ8")),v=g(a("39VY"));function g(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t=e.history,a=(e.dispatch,(0,u.useState)({})),g=(0,r.default)(a,2),E=g[0],h=g[1];(0,d.useDidMount)((0,l.default)(n.default.mark((function e(){var a,l,r,u;return n.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(a=(0,f.getParam)(t.location.search,"id"))){e.next=18;break}return l=(0,f.getCache)("article"+a),r="",l?(h(l),r=l.title):m.default.show(),e.next=7,(0,o.default)("api/queryArticleById","POST",{_id:a});case 7:if(u=e.sent,m.default.hide(),!u.data){e.next=17;break}if((0,f.setCache)("article"+a,u.data),!u.data.isHidden){e.next=15;break}return i.default.fail({msg:"文章过于久远(内容维护中)，无法访问！"}),e.abrupt("return");case 15:h(u.data),r=u.data.title;case 17:document.title="Ada - "+r;case 18:(0,o.default)("api/updateArticleViewerById","POST",{_id:a});case 19:case"end":return e.stop()}}),e,void 0)}))));return s.default.createElement("div",{className:v.default.container__},s.default.createElement("div",{className:v.default.left,onClick:function(){t.push("/article")}},s.default.createElement("i",{className:"icon-fanhui iconfont"})),s.default.createElement("div",{className:v.default.scollHidden},s.default.createElement("div",{className:v.default.scrollContainer},s.default.createElement("div",{className:v.default.contentWrapper},E&&s.default.createElement("div",{className:v.default.contentWrapper__inner},s.default.createElement("div",{className:v.default.page},s.default.createElement("div",{className:v.default.info},s.default.createElement("div",null,"类型：",E.type),s.default.createElement("div",null,"时间：",(0,f.relativeTime)(E.date)),s.default.createElement("div",null,"浏览：",E.viewer)),s.default.createElement("div",{className:v.default.content},E.summary&&(0,c.default)(E.summary.replace(/contenteditable="true"+|placeholder="Compose an epic..."+|<\/?br>/g,"")))))),s.default.createElement(p.default,{data:E.message,articleId:E._id}))))}}}]);