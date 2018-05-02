const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/pandashit");

const Admin = mongoose.model("Admin", {
  userName: String,
  password: String
});
Admin.create({userName: 'pandamaster', password: '184ff021f2a07483d4db9b722d6910d7'}, function (err) {
    if(err){
        console.error(err);
        return false;
    }
    return true;
}).then(function (res) {
    console.log('==========添加Admin成功=========');
    console.log(res);
});
