const routerExports={},FriendShip=require("./../dbmodel/FriendShip"),{sendEmail}=require("../common/util");routerExports.queryFriends={method:"get",url:"/queryFriends",route:async r=>{try{var e=await FriendShip.find({});r.body={success:!0,data:e}}catch(e){r.body={success:!1,errorMsg:e}}}},routerExports.verifyFriend={method:"post",url:"/verifyFriend",route:async r=>{try{const{request:{body:{_id:i,...t}}}=r;var e=await FriendShip.findOne({_id:i});if(!e)throw"找不到这个友情链接哦";t.verify&&!e.verify&&e.email&&sendEmail(`hi~, 你在 https://adaxh.site 提交的友情链接：${e.link}，已经通过申请，欢迎回访！`,e.email),await FriendShip.updateOne({_id:i},{$set:t}),r.body={success:!0}}catch(e){r.body={success:!1,errorMsg:e}}}},routerExports.addFriend={method:"post",url:"/addFriend",route:async r=>{try{const{request:{body:t}}=r;var{link:e}=t,i=await FriendShip.findOne({link:e});if(i){if(!i.verify)throw"友链已提交过了，您可以前往首页通过“聊骚吗”催一下";throw"这个友情链接已存在啦"}delete t.verify,await new FriendShip(t).save(),sendEmail(`有新的链接申请！${JSON.stringify(t)}`),r.body={success:!0}}catch(e){r.body={success:!1,errorMsg:e}}}},routerExports.deleteFriend={method:"post",url:"/deleteFriend",route:async r=>{try{var{request:{body:{_id:e}}}=r;await FriendShip.deleteOne({_id:e}),r.body={success:!0}}catch(e){r.body={success:!1,errorMsg:e}}}},module.exports=routerExports;