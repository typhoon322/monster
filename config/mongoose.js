var mongoose = require('mongoose');
var config = require('./config');
var model = require('../models/photo.server.model.js');

module.exports = function () {
    var db = mongoose.connect(config.mongodb);//连接数据库
    return db;//返回数据库实例
};