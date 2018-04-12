var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/pandashit";
const dbName = "pandashit";
const clctName = "uploadpics";

/**
 * 创建数据库
 */

exports.Init = function() {
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        console.log("数据库已创建！");
        var dbase = db.db(dbName);
        dbase.createCollection(clctName, function(err, res){
            if(err) throw err;
            console.log("集合已创建");
            db.close();
        });
    })
}

/**
 * 插入数据
 */

exports.AddOne = function(item) {
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbase = db.db(dbName);
        dbase.collection(clctName).insertOne(item, function(err, res){
            if(err) throw err;
            console.log("Insert Ok -- "+item);
            db.close();
        });
    })
}

exports.AddMany = function(items){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbase = db.db(dbName);
        dbase.collection(clctName).insertMany(items, function(err, res){
            if(err) throw err;
            console.log("Insert Ok -- "+items.length);
            db.close();
        });
    })
}

exports.Find = function(querys){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbase = db.db(dbName);
        dbase.collection(clctName).find(querys).toArray(function(err, result){
            if(err) throw err;
            console.log("find : \n");
            console.log(result);
            db.close();
        });
    })
}