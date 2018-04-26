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
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
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

router.get('/', async (ctx, next) => {
    ctx.response.body = {code: 0, data: {msg: 'index'}, msg: ''};
});

router.get('/index', async (ctx, next) => {
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
    photo.lastUpdateTime = new Date();
    let data = await Photo.updateOne({ _id: id}, photo);
    console.log(data);
    if(data){
        ctx.body = {code: 0, msg: 'success'};
    }else{
        ctx.body = {code: 1, msg: 'no photo found'};
    }
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
