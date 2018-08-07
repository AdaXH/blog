const routerExports = {}
const User = require('./../dbmodel/User') 
const fs = require('fs')

routerExports.login = { 
	method: 'post',
	url: '/login',
	route: async (ctx, next) => {
		const { name, pwd, state } = ctx.request.body
		const date = new Date()
		date.setDate(date.getDate() + 5)
		try {
			await callLogin(name, pwd, state)
			state && ctx.cookies.set('user', name, { expires: date, httpOnly: false })
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

function callLogin(name, pwd){
	return new Promise((resolve, reject) => {
		User.findOne({name}).then(res => !res ? reject('用户不存在')
			: 
				User.findOne({
					name, password: pwd
				}).then(res => {
					res ?
						resolve(true)
						:
						reject('用户名与密码不匹配')
				})
		)

	})
}

routerExports.getAvatar = {
	method: 'post',
	url: '/get-avatar',
	route: async (ctx, res) => {
		const { name } = ctx.request.body
		await User.findOne({ name }).then(data => {
			data ? ctx.body = {
				success: true,
				data: data.avatar
			}
				: ctx.body = {
					success: false,
					errorMsg: '无法获取头像'
				}
		}).catch(err => {
			ctx.body = {
				success: false,
				errorMsg: '无法获取头像' + err
			}
		})
	}
}

routerExports.allAvatar = {
	method: 'post',
	url: '/all_user_avatar',
	route: 
		async (ctx, next) => {
			const { name } = ctx.request.body
			try {
				const result = await getAvatar(name)
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

function getAvatar(names){
	const result = []
	return new Promise((reslove, reject) => {
		User.find({}).then(data => {
			for(let item of names)
				for(let item1 of data)			
					item === item1.name && result.push({...item1._doc , password : '***'})
			result.length !== 0 ? reslove(result) : reject('用户表为空')
		})
	})
}

routerExports.setAvatar = { 
	method: 'post',
	url: '/set-avatar',
	route: 
		async (ctx, res) => {
			const { avatar, name, fileName } = ctx.request.body
			try {
				await callSaveAvatar(avatar, name, fileName)
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

function callSaveAvatar(avatar, name, fileName){
	const bf = Buffer(avatar, 'binary')
	return new Promise((resolve, reject) => {
		fs.writeFile(`./public/upload/user_avatar/${fileName}`, bf, err => {
			err === null ? 
				User.update({ name }, { $set: { avatar: `/upload/user_avatar/${fileName}` } }).then(data => {
					data.n === 0 ? reject('更新失败') : resolve(true)
				})
			: 
				reject('保存文件时出错' + err instanceof Object ? JSON.stringify(err) : err.toString())			
		})
	})
}

routerExports.register = {
	method: 'post',
	url: '/register',
	route: async (ctx, nect) => {
		const { name, pwd } = ctx.request.body
		try {
			await callRegister(name, pwd)
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

function callRegister(name, pwd){
	return new Promise((resolve, reject) => {
		User.findOne({ name }, (err, result) => {
			if(result)
				reject('用户名已存在')
			else{
				new User({
					name, password: pwd
				}).save().then(_ => resolve(true))
					.catch(err => reject('注册失败' + err instanceof Object ? JSON.stringify(err) : err.toString()))
			}
		})
	})
}
module.exports = routerExports