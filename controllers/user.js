const routerExports = {}
const User = require('./../dbmodel/User')
const fs = require('fs')
const Base64 = require('js-base64').Base64
const SinaCloud = require('scs-sdk');
const accessKey = require('../bucketConfig').accessKey
const jwt = require('jsonwebtoken')
const svgCaptcha = require('svg-captcha')

const secret = 'secret'
/* 通过token获取JWT的payload部分 */
function getJWTPayload(token) {
	// 验证并解析JWT
	if (!token) return
	return jwt.verify(token, 'secret');
}

function getToken(payload = {}) {
	return jwt.sign(payload, secret, { expiresIn: '1day' });
}

routerExports.uploadGallery = {
	method: 'post',
	url: '/uploadGallery',
	route: async ctx => {
		const { fileName, dataUrl } = ctx.request.body
		try {
			const payload = getJWTPayload(ctx.headers.authorization)
			if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin)
					throw '当前用户无权限'
			}
			await callSaveGalleryToBucket(fileName, dataUrl)
			ctx.body = {
				success: true
			}
		} catch (error) {
			console.log(error)
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
			}
		}
	}
}

function callSaveGalleryToBucket(fileName, dataUrl) {
	const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64')

	return new Promise((resolve, reject) => {
		const s3 = new SinaCloud.S3();
		s3.putObject({
			ACL: 'public-read',
			Bucket: 'ada.bucket',
			Key: `extra/${fileName.replace(/jpeg+|JPG/g, 'jpg')}`,
			Body: bf
		}, function (error, response) {
			if (error) {
				reject(error);
			} else {
				resolve()
			}
		});
	})
}

function callSaveGalleryToLocal(fileName, dataUrl) {
	return new Promise((resolve, reject) => {
		const bf = Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64')
		fs.writeFile(`./public/resouce/extra/${fileName.replace(/jpeg+|JPG/g, 'jpg')}`, bf, err => {
			err === null ?
				resolve()
				:
				reject('保存文件时出错' + err instanceof Object ? JSON.stringify(err) : err.toString())
		})
	})
}

routerExports.getCaptcha = {
	method: 'post',
	url: '/getCaptcha',
	route: async ctx => {
		const captcha = svgCaptcha.create({
			size: 4,
			ignoreChars: '',
			noise: 2,
			color: true,
			background: 'transparent'
		})
		ctx.session = {}
		ctx.session.captcha = captcha.text
		ctx.body = captcha.data
	}
}

routerExports.setPics = {
	method: 'post',
	url: '/setPics',
	route: async ctx => {
		const { type, binary } = ctx.request.body
		try {
			const payload = getJWTPayload(ctx.headers.authorization)
			if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin)
					throw '当前用户无权限'
			}
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
	return new Promise((resolve, reject) => {
		const bf = Buffer(binary, 'binary')
		fs.writeFile(`./public/resouce/images/${type}.jpg`, bf, err => {
			if (err === null) {
				User.findOne({ name: 'Ada' }).then(result => {
					if (result) {
						const picData = result.pics || { glitchUrl: ' ', flyUrl: '' }
						picData[type === 'glitch' ? 'glitchUrl' : 'flyUrl'] = `resouce/imagses/${type}.jpg`
						User.updateOne({ name: 'Ada' }, { $set: { pics: { ...picData } } }).then(res => res ? resolve() : reject('更新出错')).catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
					}
				}).catch(err => reject(err instanceof Object ? JSON.stringify(err) : err.toString()))
			} else
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
		date.setDate(date.getDate() + 2)
		try {
			const result = await callLogin(name, pwd, state)
			state && ctx.cookies.set('user', Base64.encode(name), { expires: date, httpOnly: false, overwrite: false })
			ctx.cookies.set('token', getToken({ _id: result._id }), { expires: date, httpOnly: false, overwrite: false })
			result.name = name
			console.log(name + ' 上线')
			ctx.body = {
				...result,
				token: getToken({ _id: result._id })
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error
			}
		}
	}
}

routerExports.getUserInfor = { // 新版本废物
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

routerExports.getUserInfoByToken = {
	method: 'post',
	url: '/getUserInfoByToken',
	route: async (ctx, next) => {
		try {
			const payload = getJWTPayload(ctx.headers.authorization)
			if (!payload) throw 'token认证失败'
			const user = await User.findOne({ _id: payload._id })
			delete user._doc.password
			console.log(user.name + ' 重新连接')
			ctx.body = {
				success: true,
				user
			}
		} catch (error) {
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
			}
		}
	}
}

function callGerUser(name) {
	return new Promise((resolve, reject) => {
		User.findOne({ name }).then(res => {
			res ? resolve(res) : reject('当前用户不存在')
		}).catch(err => reject('无法获取当前用户信息'))
	})
}

function callLogin(name, pwd) {
	return new Promise((resolve, reject) => {
		User.findOne({ name }).then(res => !res ? reject('用户不存在')
			:
			User.findOne({
				name, password: pwd
			}).then(res => {
				res ?
					resolve({
						success: true,
						_id: res._id,
						admin: res.admin || false,
						avatar: res.avatar || false
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

function callIntroduce() {
	return new Promise((resolve, reject) => {
		User.findOne({ name: 'Ada' }).then(res => {
			if (res) resolve(res.introduce)
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
			const payload = getJWTPayload(ctx.headers.authorization)
			if (!payload) throw 'token认证失败'
			else {
				const { _id } = payload
				const user = await User.findOne({ _id })
				if (!user.admin || user.name !== 'Ada')
					throw '当前用户无权限'
			}
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

function callUpdateIntroduce(introduce) {
	return new Promise((resolve, reject) => {
		User.updateOne({ $set: { introduce } }).then(res => {
			res.ok === 1 ? resolve(true) : reject('更新失败')
		}).catch(err => reject(err))
	})
}

routerExports.admin = { // 新版本废物， 不安全
	method: 'post',
	url: '/checkAdmin',
	route: async (ctx, next) => {
		const { name } = ctx.request.body
		const na = JSON.parse(Base64.decode(name)).name
		try {
			const result = await callCheckAdmin(na)
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

function callCheckAdmin(name) {
	return new Promise((resolve, reject) => {
		User.findOne({ name }).then(data => data && data.admin ? resolve(true) : reject(name + '无权限'))
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

routerExports.allAvatar = { // 将废弃
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

function getAvatar(names) {
	const result = []
	if (names === 'all') {
		return new Promise((resolve, reject) => {
			User.find({}).then(data => {
				const imgs = data.map(item => item.avatar)
				imgs ? resolve(imgs) : reject('头像获取失败')
			}).catch(err => reject(err))
		})
	}
	else
		return new Promise((reslove, reject) => {
			User.find({}).then(data => {
				for (let item of names)
					for (let item1 of data)
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
				const payload = getJWTPayload(ctx.headers.authorization)
				if (!payload) throw 'token认证失败'
				// const userName = await User.findOne({ _id: payload._id })
				const src = await callSaveAvatarToBucket(avatar, payload._id, fileName)
				ctx.body = {
					success: true,
					src
				}
			} catch (error) {
				console.log(error)
				ctx.body = {
					success: false,
					errorMsg: error instanceof Object ? (/JsonWebTokenError+|TokenExpiredError/.test(JSON.stringify(error)) ? '会话已过期，请重新登录验证' : JSON.stringify(error)) : error.toString()
				}
			}
		}
}

async function callSaveAvatarToBucket(avatar, _id, fileName) {
	const bf = Buffer(avatar, 'binary')
	const imgs = fileName.split('.')
	const imgType = /gif+|GIF/.test(imgs[imgs.length - 1]) ? 'gif' : 'jpg'

	return new Promise((resolve, reject) => {
		const s3 = new SinaCloud.S3();
		s3.putObject({
			ACL: 'public-read',
			Bucket: 'ada.bucket',
			Key: `avatar/${fileName}${_id}.${imgType}`,
			Body: bf
		}, function (error, response) {
			if (error) {
				reject(error);
			} else {
				User.updateOne({ _id }, { $set: { avatar: `http://sinacloud.net/ada.bucket/avatar/${fileName}${_id}.${imgType}${accessKey}` } }).then(data => data.n === 1 ? resolve(bf) : reject('头像更新失败'))
			}
		});
	})
}

async function callSaveAvatarToLocal(avatar, _id, fileName) {
	const bf = Buffer(avatar, 'binary')
	const imgs = fileName.split('.')
	const imgType = /gif+|GIF/.test(imgs[imgs.length - 1]) ? 'gif' : 'jpg'
	return new Promise((resolve, reject) => {
		fs.writeFile(`./public/upload/user_avatar/${_id}.${imgType}`, bf, err => {
			if (err === null)
				User.updateOne({ _id }, { $set: { avatar: `/upload/user_avatar/${_id}.${imgType}` } }).then(data => data.n === 1 ? resolve(bf) : reject('头像更新失败'))
			else
				reject('保存文件时出错' + err instanceof Object ? JSON.stringify(err) : err.toString())
		})
	})
}

routerExports.register = {
	method: 'post',
	url: '/register',
	route: async (ctx, nect) => {
		const { name, pwd, captchaCode } = ctx.request.body
		try {
			const { session: { captcha } } = ctx
			if (captcha.toLowerCase() !== captchaCode.toLowerCase()) throw '验证码不正确'
			// const data = await callRegister(name, pwd)
			const hasUser = await User.findOne({ name })
			if (hasUser) throw '用户已存在'
			const saveUser = await new User({ name, password: pwd }).save()
			delete saveUser._doc.password
			ctx.body = {
				success: true,
				...saveUser._doc
			}
		} catch (error) {
			console.log(error)
			ctx.body = {
				success: false,
				errorMsg: error instanceof Object ? JSON.stringify(error) : error.toString()
			}
		}
	}
}

module.exports = routerExports