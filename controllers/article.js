const Article = require('./../dbmodel/Article') 
const User = require('./../dbmodel/User')
const Message = require('./../dbmodel/Message')

const jwt = require('jsonwebtoken')

/* 通过token获取JWT的payload部分 */
function getJWTPayload(token) {
  // 验证并解析JWT
  if (!token) return
  return jwt.verify(token, 'secret');
}

const routerExports = {}
routerExports.deleteArticle = {
	method: 'post',
	url: '/deleteArticle',
	route: async (ctx, next) => {
		const { _id } = ctx.request.body
		try {
			const payload = getJWTPayload(ctx.headers.authorization)     
            if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin) 
					throw '当前用户无权限'
			}
			await callDeleteArticleById(_id)
			ctx.body = {
				success: true
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
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
		Article.deleteOne({ _id }).then(data => {
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
			const payload = getJWTPayload(ctx.headers.authorization)     
            if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin) 
					throw '当前用户无权限'
			}
			await callSaveArticle(time, date, year, summary, type)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
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
		const { _id } = ctx.request.body
		// const newViewer = Number(viewer) + 1
		try {
			// await callUpdateArticleViewer(_id, newViewer)
			const article = await Article.findOne({ _id })
			if (!article) throw '文章不存在'
			await Article.updateOne({ _id }, { $set: { viewer: article.viewer + 1 } })
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = { success: false, erorMsg: error.toString() }
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
			const payload = getJWTPayload(ctx.headers.authorization)     
            if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin) 
					throw '当前用户无权限'
			}
			await callUpdateArticleById(_id, summary, type)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				erorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
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

routerExports.getArticlePageSize = {
	method: 'post',
	url: '/getArticlePageSize',
	route: async ctx => {
		const { pageSize, index } = ctx.request.body
		try {
			const result = await callGetArticlePageSize(pageSize)
			const temp = [...result]
			const data = {
				data: temp.slice(index, pageSize)
			}
			ctx.body = {
				success: true,
				data: data.data,
				total: result.length,
				isOver: result.length <= pageSize
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callGetArticlePageSize() {
	return new Promise((resolve, reject) => {
		Article.find({}, (err, res) => {
			const result = res.sort((a, b) => parseInt((b.year + b.date).replace(/-/g, '')) - parseInt((a.year + a.date).replace(/-/g, ''))
			)
			err ? reject([]) : resolve(result)
		})
	})
}

module.exports =  routerExports 
 