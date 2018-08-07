const mongoose = require('mongoose')

module.exports = mongoose.model('articles', mongoose.Schema({
    date: String,
    year: String,
    type: String,
    summary: String,
    time: String,
    viewer: Number
}))