const routerExports={},Config=require("./../dbmodel/BlogConfig");routerExports.updateConfig={method:"post",url:"/updateConfig",route:async e=>{var{config:o}=e.request.body;try{await Config.updateOne({},{$set:{...o}}),e.body={success:!0}}catch(o){e.body={success:!1,errorMsg:o}}}},routerExports.getConfig={method:"get",url:"/getConfig",route:async e=>{try{var o=await Config.findOne({});e.body={success:!0,config:o}}catch(o){e.body={success:!1,errorMsg:o}}}},module.exports=routerExports;