const{isTarget,isJSON,needFilter,getTime}=require("../common/util");module.exports=async(r,t)=>{const{request:{body:s={},url:a,method:i,header:o}}=r;var n=Date.now();await t();t=Date.now();try{var{success:l,errorMsg:d,traceId:c}=JSON.parse(isJSON(r.body,"String")?r.body:"{}"),u=o["user-agent"];if(needFilter(u)||needFilter(a))return;if(a.endsWith(".js")||"GET"===i&&a.includes("upload/user_avatar")||a.includes("resouce/gallery"))return;var g=/Mobile+|iPhone+|Android/.test(u)?"Mobile":"pc",m=getTime();let e="unknown";e="Mobile"==g?"Mobile":/native/.test(o.referer)?"Native":"dva",s instanceof Object&&"summary"in s&&delete s.summary,"dataUrl"in s&&delete s.dataUrl;var y=`客户端: ${u||""}
版本： ${e}
date: ${m} 
api:  [${i} ${t-n}ms ${a}] 
request: ${JSON.stringify(isTarget(s,"Object")?s:{})} 
response: ${JSON.stringify({success:l,errorMsg:d,traceId:c})}
    `;console.log(y)}catch(e){console.log("error",e)}};