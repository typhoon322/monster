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
mongoose.connect('mongodb://127.0.0.1:27017/pandashit');
const Photo = mongoose.model('Photo', {
    url: String,
    title: String,
    desc: String,
    createdTime: Date
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

/**
 * 获取上传token
 */
router.get('/auth', async (ctx, next) => {
    ctx.response.body = {"token": asyncUtil.fetchUploadToken()};
});


router.post('/add', async(ctx) => {
    let body = ctx.request.body;
    console.info(body);
    const array = body.items;
    array.forEach(element => {
        element.createdTime = new Date();
    });

    await Photo.create(array, function (err, candies) {
        if(err){
            console.error(err);
            ctx.response.body = {code: 1, msg: 'Internal error'};
            return;
        }
    }).then(function (res) {
        console.log('==========添加成功=========');
        console.log(res);
        ctx.response.body = {code: 0, msg: 'success'};
    });
});

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
