const routerExports = {}
const User = require('./../dbmodel/User') 
const fs = require('fs')
const Base64 = require('js-base64').Base64

routerExports.setPics = {
	method: 'post',
	url: '/setPics',
	route: async ctx => {
		const { type, binary } = ctx.request.body
		try {
			await callHandlePic(type, binary)
			ctx.body = { success: true }
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}	
		}
	}
}

const callHandlePic = (type, binary) => {
	return new Promise((resolve , reject) => {
		const bf = Buffer(binary, 'binary')
		fs.writeFile(`./public/resouce/images/${type}.jpg`, bf, err => {
			if (err === null ){
				User.findOne({ name: 'Ada' }).then(result => {
					if (result ){
						const picData = result.pics || { glitchUrl: ' ', flyUrl: '' }
						picData[type === 'glitch' ? 'glitchUrl' : 'flyUrl'] = `resouce/imagses/${type}.jpg`
						User.updateOne({ name: 'Ada' }, { $set: { pics: { ...picData } } }).then(res => res ? resolve() : reject('更新出错')).catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
					}
				}).catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
			}else
				reject('保存文件时出错' + err instanceof Object ? JSON.stringify(err) : err.toString())
		})
	})
}

routerExports.login = { 
	method: 'post',
	url: '/login',
	route: async (ctx, next) => {
		const { name, pwd, state } = ctx.request.body
		const date = new Date()
		date.setDate(date.getDate() + 5)
		try {
			const result = await callLogin(name, pwd, state)
			state && ctx.cookies.set('user', Base64.encode(name), { expires: date, httpOnly: false })
			result.name = name
			ctx.body = result
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

routerExports.getUserInfor = {
	method: 'post',
	url: '/getUserInfor',
	route: async (ctx, next) => {
		const { name } = ctx.request.body
		try {
			const user = await callGerUser(name)
			delete user._doc.password
			ctx.body = {
				success: true, 
				user
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callGerUser(name){
	return new Promise((resolve, reject) => {
		User.findOne({ name }).then(res => {
			res ? resolve(res) : reject('当前用户不存在')
		}).catch( err => reject('无法获取当前用户信息'))
	})
}

function callLogin(name, pwd){
	return new Promise((resolve, reject) => {
		User.findOne({name}).then(res => !res ? reject('用户不存在')
			: 
				User.findOne({
					name, password: pwd
				}).then(res => {
					res ?
						resolve({
							success: true,
							admin : res.admin || false,
							avatar : res.avatar || false
						})
						:
						reject('用户名与密码不匹配')
				})
		)

	})
}

routerExports.introduce = {
	method: 'post',
	url: '/introduce',
	route: async (ctx, next) => {
		try {
			const introduce = await callIntroduce()
			ctx.body = {
				success: true,
				'introduce': String(introduce)
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

function callIntroduce(){
	return new Promise((resolve, reject) => {
		User.findOne({ name: 'Ada'}).then(res => {
			if(res) resolve(res.introduce)
			else reject('查询失败')
		}).catch(err => reject(err))
	})
}

routerExports.updateIntroduce = {
	method: 'post',
	url: '/updateIntroduce',
	route: async (ctx, next) => {
		const { introduce } = ctx.request.body
		try {
			const success = await callUpdateIntroduce(introduce)
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

function callUpdateIntroduce(introduce){
	return new Promise((resolve, reject) => {
		User.updateOne({ $set: { introduce } }).then(res => {
			res.ok === 1 ? resolve(true) : reject('更新失败')
		}).catch(err => reject(err) )
	})
}

routerExports.admin = {
	method: 'post',
	url: '/checkAdmin',
	route: async(ctx, next) => {
		const { name } = ctx.request.body
		const na = JSON.parse(Base64.decode(name)).name
		try {
			const result = await callCheckAdmin(na)
			ctx. body = {
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

function callCheckAdmin(name){
	return new Promise((resolve, reject) => {
		User.findOne({ name }).then(data => data && data.admin ? resolve(true) : reject( name + '无权限') )
			.catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
	})
}

routerExports.getAvatar = {
	method: 'post',
	url: '/get-avatar',
	route: async (ctx, res) => {
		const { name } = ctx.request.body
		const na = JSON.parse(Base64.decode(name)).name
		await User.findOne({ name: na }).then(data => {
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
					item === item1.name && result.push({ name: item1.name, avatar: item1.avatar })
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
				User.updateMany({ name }, { $set: { avatar: `/upload/user_avatar/${fileName}` } }).then(data => {
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
			const data = await callRegister(name, pwd)
			ctx.body = {
				success: true,
				...data
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
				}).save().then(_ => resolve({ name, admin: false, avatar: '/upload/user_avatar/default_avatar.jpg'}))
					.catch(err => reject('注册失败' + err instanceof Object ? JSON.stringify(err) : err.toString()))
			}
		})
	})
}
module.exports = routerExports