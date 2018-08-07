const mongoose = require('mongoose')

const dynamicCollection = mongoose.model('dynamics', mongoose.Schema({
    title: String,
    content: String,
    date: String,
    upvote: Number,
    msg: Array({
        context: String,
        date: String
    })
}))
module.exports = dynamicCollection