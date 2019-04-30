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
			// await callDeleteArticleById(_id)
			const result = await Article.findByIdAndDelete({ _id })
			if (result === null) throw '删除失败，文章不存在'
			ctx.body = {
				success: true
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : 
					/_id/.test(JSON.stringify(error)) ? '文章不存在' : JSON.stringify(error)
				) : error.toString()
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
			const result = await Article.findById(_id)
			ctx.body = {
				success: true,
				data: result
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: '文章id:' + _id +'不存在'
			}
		}
	}
}

routerExports.saveArticle = {
	method: 'post',
	url: '/saveArticle',
	route: async (ctx, next) => {
		const { date, year, summary, type, time, title =  'title' } = ctx.request.body
		try {
			const payload = getJWTPayload(ctx.headers.authorization)     
            if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin) 
					throw '当前用户无权限'
			}
			// await callSaveArticle(time, date, year, summary, type, title)
			const saveResult = await new Article({ time, date, year, summary, type, viewer: 0, title }).save()
			if (!saveResult._id) throw '保存失败'
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
			}
		}
	}
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

routerExports.updateView = {
	method: 'post',
	url: '/updateArticleById',
	route: async (ctx, next) => {
		const { _id, summary, title = '', type } = ctx.request.body
		try {
			const payload = getJWTPayload(ctx.headers.authorization)     
            if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin) 
					throw '当前用户无权限'
			}
			// await callUpdateArticleById(_id, summary, type, title)
			const updateResult = await Article.updateOne({ _id }, { $set: { summary, type, title } })
			console.log(updateResult)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				erorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' 
					: /Cast to ObjectId failed for value/.test(JSON.stringify(error)) ? '文章id不存在' : error.toString()) 
				: error.toString()
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
 