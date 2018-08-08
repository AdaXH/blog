const mongoose = require('mongoose')

module.exports = mongoose.model('users', mongoose.Schema({
    name: String,
    password: String,
    avatar: String,
    admin: {
        type: Boolean,
        default: false
    }
}))