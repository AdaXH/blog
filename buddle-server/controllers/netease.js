const{MusicClient}=require("netease-music-sdk"),{getRandomLength}=require("../common/util"),Config=require("./../dbmodel/BlogConfig"),routerExports={},sdk=new MusicClient;routerExports["netease/get-comment"]={method:"get",url:"/netease/get-comment",route:async o=>{try{var{query:{limit:t=40,keyword:n="爱",type:r=1,offset:s=Math.floor(20*Math.random())}}=o,{result:m={}}=await sdk.search("undefined"===n?"爱":n,r,t,s);let e={song:{},comments:[]};if(m.songs)for await(const f of m.songs){var a=await sdk.getSongComment(f.id);if(a.hotComments&&a.hotComments.length){var{id:c,name:g}=f;if(e={comments:a.hotComments,song:{songId:c,songName:g}},3<e.comments.length)break}}var d=getRandomLength(e.comments.length),{content:i,user:{nickname:l,avatarUrl:h},commentId:u}=e.comments[d<0?0:d]||{user:{}};o.body={success:!0,comment:{content:i,commentId:u,name:l,...e.song,avatarUrl:h}}}catch(e){console.log("error",e),o.body={success:!1,errorMsg:e,error:e}}}},routerExports["/ada/get-comment"]={method:"get",url:"/ada/get-comment",route:async t=>{try{let{query:{keyword:e}}=t;if(!e){var n,r,[s]=await Config.find({},{neteaseKeyword:1})||[{}];const{neteaseKeyword:u}=s;u&&(n=u.split(","),r=getRandomLength(n.length),e=n[r])}var m=Math.floor(20*Math.random()),a=decodeURIComponent(e).replace(/鲸小萌 /,""),{result:c={}}=await sdk.search(a,1,40,m);let o={song:{},comments:[]};if(c.songs)for await(const f of c.songs){var g=await sdk.getSongComment(f.id);if(g.hotComments&&g.hotComments.length){var{id:d,name:i}=f;if(o={comments:g.hotComments,song:{songId:d,songName:i}},5<o.comments.length)break}}var l=getRandomLength(o.comments.length),{content:h}=o.comments[l<0?0:l]||{};if(!h)return void(t.body="糟糕，系统坏了T.T");t.body=h}catch(e){console.log("error",e),t.body=e,t.body={success:!1,errorMsg:e,error:e}}}},module.exports=routerExports;