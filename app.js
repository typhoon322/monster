
const AsyncUtil = require('./lib/asyncUtil');
var asyncUtil = new AsyncUtil();

const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
var router = new Router();

const BodyParser = require('koa-bodyparser');
app.use(BodyParser());

const cors = require('koa-cors');
app.use(cors());

app.use(async(ctx,next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.headers}...`)
    await next();
});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/pandashit');
const Photo = mongoose.model('Photo', {
    url: String,
    title: String,
    desc: String,
    createdTime: Date,
    lastUpdateTime: Date
});

const Admin = mongoose.model('Admin', {
    userName: String,
    password: String
});

router.get('/', async (ctx, next) => {
    ctx.response.body = {code: 0, data: {msg: 'index'}, msg: ''};
});

// const userName = 'pandamaster';

const jwt = require('jsonwebtoken');
const secretKey = 'pandamastersercretkeytologin';

router.post('/login',async (ctx, next) => {
    let reqBody = ctx.request.body;
    console.log(reqBody);
    let userName = reqBody.userName;
    let password = reqBody.password;
    // await Admin.create({userName: 'pandamaster', password: '184ff021f2a07483d4db9b722d6910d7'}, function (err) {
    //     if(err){
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }).then(function (res) {
    //     console.log('==========添加Admin成功=========');
    //     console.log(res);
    // });
    await Admin.findOne({userName: 'pandamaster'},  (err, user) => {
        if(err) throw err;
        console.log(user);
        if(!user){
            ctx.response.body = {code: 1, msg: '你居然忘记了自己的名字ß？'};
            return;
        }
        if(user.password !== password){
            ctx.response.body = {code: 1, msg: '你是猪嘛？密码错了啊！'};
            return;
        }
        const token = jwt.sign(
            { 
                data: user,
                expiresIn: (60 * 60 )
            }, secretKey, { expiresIn: 60 * 60 });
        console.log(token);
        ctx.response.body = {code: 0, data: { token: token }, msg: '可以啊～'};
    });
});

function isValidToken(ctx) {
    let token = (ctx.request.body && ctx.request.body.access_token) || (ctx.request.query && ctx.request.query.access_token) || ctx.request.header["x-access-token"];
    
    console.log('token : ');
    console.log(token);
    console.log('x-access-token');
    console.log(ctx.request.header['x-access-token']);

    if(!token){
        return false;
    }
    var decoded = jwt.decode(token, secretKey);
    console.log(decoded);
    if(token.exp <= Date.now()){
        return false;
    }
    return true;
}

router.get('/index', async (ctx, next) => {

   if(!isValidToken(ctx)){
        ctx.response.body = {code: -1, msg: 'Invalid Token'};
        return;
   }

    await Photo.find({}, function (err, results) {
        if(err){
            console.error(err);
            ctx.response.body = {code: 1, msg: 'Internal Error'};
          return;
        }
      }).then(function (res) {
        console.log(res);
          if(res){
            ctx.response.body = {code: 0, data: res, msg: 'Success'};//以json数据类型返回值
          }
      });
});

router.get('/photo/:id', async (ctx, next) => {
    await Photo.findById(ctx.params.id, function (err, results) {
        if(err){
            console.error(err);
            ctx.response.body = {code: 1, msg: 'Internal Error'};
          return;
        }
      }).then(function (res) {
        console.log(res);
          if(res){
            ctx.response.body = {code: 0, data: res, msg: 'Success'};//以json数据类型返回值
          }
      });
});

router.delete('/photo/:id', async (ctx) => {
    let id = ctx.params.id;
     await Photo.deleteOne({_id: id}, (err) => {
        console.log(ctx.params);
        if(err){
            console.error(err);
            ctx.body = {code: 1, msg: 'Internal Error'};
          return false;
        }
        ctx.body = {code: 0, data: null, msg: 'Success'};//以json数据类型返回值
        console.log("删除成功 ==》 "+ id);
        return true;
      });

});

/**
 * 获取上传token
 */
router.get('/auth', async (ctx, next) => {
    ctx.response.body = {"token": asyncUtil.fetchUploadToken()};
});


router.post('/photo', async(ctx) => {
    let body = ctx.request.body;
    console.info(body);
    const photo = body;
    photo.createdTime = new Date();
    photo.lastUpdateTime = new Date();
    await Photo.create(photo, function (err) {
        if(err){
            console.error(err);
            ctx.response.body = {code: 1, msg: 'Internal error'};
            return false;
        }
        return true;
    }).then(function (res) {
        console.log('==========添加成功=========');
        console.log(res);
        ctx.response.body = {code: 0, msg: 'success'};
    });
});

router.put('/photo/:id', async (ctx, next) => {
    console.log(ctx.params);
    let id = ctx.params.id;
    console.log("id == "+id);
    const body = ctx.request.body;
    const photo = body;
    console.log(photo);
    photo.lastUpdateTime = new Date();
    let error = null;
    let item = null;
   let data = await Photo.findOneAndUpdate({ _id: id}, photo);
   console.log(data);
    if (!data) {
      ctx.response.body = { code: 1, msg: "update faild" };
      return;
    }
    ctx.response.body = { code: 0, data: data, msg: "update success" };
    console.log(ctx.response.body);
    // if(error){
    //     ctx.body = { code: 1, msg: error };
    //     return;
    // }
    // ctx.body = { code: 0, data: data, msg: "update success" };
    // ctx.response.body = { code: 0, data: data, msg: "update success" };
});

// router.put('/photo/:id', async (ctx, next) => {
//     console.log(ctx.params);
//     let id = ctx.params.id;
//     console.log("id == "+id);
//     const body = ctx.request.body;
//     const photo = body;
//     photo.lastUpdateTime = new Date();
//     let data= await Photo.updateOne({ _id: id}, (err, raw) => {
//         if(err){
//             console.error(err);
//             ctx.body = {code: 1, msg: 'Internal error'};
//             return ctx.response.send();
//         }
//         // console.log(res);
//         console.log('findOneAndUpdate === ');
//         console.log(raw);
//         ctx.response.body = {code: 0, msg: 'success'};
//         return true;
//     });
//     console.log("<<<<<<<<<<<<<<data>>>>>>>>>>>>>>");
//     console.log(data);
// });


// var qiniu = require('qiniu');

// function getMac(){
//     var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//     console.log('mac : '+mac);
//     return mac;
// }


// function getBucketManager(){
//     var mac = getMac();
//     var config = new qiniu.conf.Config();
//     config.zone = qiniu.zone.Zone_z2;
//     var bucketManager = new qiniu.rs.BucketManager(mac,config);
//     return bucketManager;
// }


app.use(router.routes()).use(router.allowedMethods);

app.listen(3020,function(){
    console.log('CORS-enabled web server listening on port 3020');
});
