const mongoose = require('mongoose')

module.exports = mongoose.model('configs', mongoose.Schema({
    bgColor: {
        type: String,
        default: 'rgba(74, 74, 74, 0.64)'
    },
    bgImg: {
        type: String,
        default: 'static/bg2.2bec7f6d.jpg'
    },
    blogTitle: {
        type: String,
        default: 'Ada - Blog'
    },
    welcome: String,
    text1: String,
    text2: String,
}))