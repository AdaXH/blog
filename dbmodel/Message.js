const mongoose = require('mongoose')

module.exports = mongoose.model('messages', mongoose.Schema({
    name: String,
    content: String,
    date: String,
    repeat: Array({
        info: String,
        date: String,
        name: String,
        toRepeat: String
    }),
    avatar: {
        default: '/upload/user_avatar/default_avatar.jpg',
        type: String
    }
}))