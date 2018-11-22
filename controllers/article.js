const Article = require('./../dbmodel/Article') 
const routerExports = {}
routerExports.deleteArticle = {
	method: 'post',
	url: '/deleteArticle',
	route: async (ctx, next) => {
		const { _id } = ctx.request.body
		try {
			await callDeleteArticleById(_id)
			ctx.body = {
				success: true
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

routerExports.queryArticleById= {
	method: 'post',
	url: '/queryArticleById',
	route: async (ctx, next) => {
		const { _id } = ctx.request.body
		try {
			const result = await callArticleById(_id)
			ctx.body = {
				success: true,
				data: result
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callArticleById(_id){
	return new Promise((resolve, reject) => {
		Article.findOne({ _id }).then(res => {
			res ? resolve(res) : reject('无法获取文章')
		}).catch(err => reject(err.toString()))
	})
}

function callDeleteArticleById(_id){
	return new Promise((resolve, reject) => {
		Article.remove({ _id }).then(data => {
			data.n === 1 ? resolve(true) : reject('删除失败，文章不存在')
		}).catch(err => reject('删除失败') )
	})
}

routerExports.saveArticle = {
	method: 'post',
	url: '/saveArticle',
	route: async (ctx, next) => {
		const { date, year, summary, type, time } = ctx.request.body
		try {
			await callSaveArticle(time, date, year, summary, type)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callSaveArticle(time, date, year, summary, type){
	return new Promise((resolve, reject) => {
		new Article({
			time, date, year, summary, type, viewer: 0
		}).save().then(res => res ? 
			resolve(true) 
			: 
			reject('发布失败'))
			.catch(err => reject('发布失败' + err instanceof Object ? JSON.stringify(err) :  err.toString()))
	})
}

routerExports.updateArticle = {
	method: 'post',
	url: '/updateArticleViewerById',
	route: async (ctx, next) => {
		const { _id, viewer } = ctx.request.body
		const newViewer = Number(viewer) + 1
		try {
			await callUpdateArticleViewer(_id, newViewer)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = { success: false }
		}
	}
}

function callUpdateArticleViewer(_id, viewer){
	return new Promise((resolve, reject) =>{
		Article.updateMany({ _id }, { $set: { viewer } }).then(data => {
			data.n === 0 ? reject(false) : resolve(true)
		}).catch(err => reject(false))
	})
}

routerExports.updateView = {
	method: 'post',
	url: '/updateArticleById',
	route: async (ctx, next) => {
		const { _id, summary, type } = ctx.request.body
		try {
			await callUpdateArticleById(_id, summary, type)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				erorMsg: error
			}
		}
	}
}

function callUpdateArticleById(_id, summary, type){
	return new Promise((resolve, reject) => {
		Article.updateMany({ _id }, { $set: { summary, type } }).then( data => {
			data.ok === 0 ? reject('更新失败') : resolve(true)
		}).catch(err => reject('更新时出错' + err instanceof Object ? JSON.stringify(err) : err.toString()) )
	})
}

routerExports.queryArticle = {
	method: 'post',
	url: '/queryArticleById',
	route: async (ctx, next) => {
		const { _id } = ctx.request.body
		try {
			const data = await callQueryArticleById(_id)
			ctx.body = { 
				success: true,
				data
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callQueryArticleById(_id){
	return new Promise((resolve, reject) => {
		Article.findOne({_id}).then(data => {
			data ? resolve(data) : reject('没有找到文章信息')
		}).catch(err => reject('文章已不存在')  )
	})
}

module.exports =  routerExports 
 