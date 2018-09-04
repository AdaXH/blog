const mongoose = require('mongoose')

module.exports = mongoose.model('users', mongoose.Schema({
    name: String,
    password: String,
    avatar: {
        type: String,
        default: '/upload/user_avatar/default_avatar.jpg'
    },
    admin: {
        type: Boolean,
        default: false
    },
    introduce: {
        type: String,
        default: undefined
    }
}))