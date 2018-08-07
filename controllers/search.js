const Dynamic = require('./../dbmodel/Dynamic') 
const Article = require('./../dbmodel/Article') 

const routerExports = {}

function getDynamic(reg , data){
	return new Promise((resolve,reject)=>{
		const result = []
		Dynamic.find({
			content : reg
		}).then(res=>{
			if(res){
				for(let item of res){
				let index = item.content.indexOf(data)
				let summary = item.content
				let title = item.title
				let _id = item._id
				let obj = {
					date : item.date,
					type : '动态',
					summary,
					title,
					_id
				}
				result.push(obj)
			}
			Dynamic.find({title : reg}).then(res=>{
				if(res){
					for(let item of res){
						let index = item.content.indexOf(data)
						let summary = item.content
						let title = item.title
						let _id = item._id
						let obj = {
							date : item.date,
							type : '动态',
							summary,
							title,
							_id
						}
						result.push(obj)
					}
					resolve(result)
				}
			})
		}else resolve([])
		}).catch(err=>{
			resolve([])
		})
	})
} 

function getArticle(reg , data){
	return new Promise((resolve,reject)=>{
		const result = []
		Article.find({
			summary : reg
		}).then(res=>{
			if(res){
				for(let item of res){
				let index = item.summary.indexOf(data)
				let summary = item.summary.slice(index, index+data.length+100)
				let _id = item._id
				let obj = {
					date : item.year + '-' + item.date,
					type : '文章',
					summary,
					_id
				}
				result.push(obj)
			}
			resolve(result)
		}else resolve([])
		}).catch(err=>{
			resolve([])
		})
	})
}

routerExports.search = { 
	method: 'post',
	url: '/search',
	route: async (ctx, next) => {
		const { data } = ctx.request.body
		const regEx = new RegExp(data + '|(\\b' + data + '\\b)')
		try {
			const dynamics = await getDynamic(regEx, data)
			const articles = await getArticle(regEx, data)
			ctx.body = {
				success: true,
				result: dynamics.concat(articles)
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

module.exports = routerExports 