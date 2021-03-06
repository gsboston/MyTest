const mongoose = require('mongoose')

// 类似数据库中的表
let personSchema = new mongoose.Schema({
    name: String,
    age: Number
})

// 模型与schema做了关联，导出
// 文件名就是"表名"
module.exports = mongoose.model('Person', personSchema)