const AsyncUtil = require('./lib/asyncUtil');

const Koa = require('koa');

const router = require('koa-router')();

const app = new Koa();

const cors = require('koa-cors');

app.use(cors());

app.use(async(ctx,next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    await next();
});

/**
 * 获取上传token
 * name：bucket 的名字
 */
router.get('/auth/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = {"token": new AsyncUtil().fetchUploadToken(name)};
});

var qiniu = require('qiniu');

function getMac(){
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    console.log('mac : '+mac);
    return mac;
}


function getBucketManager(){
    var mac = getMac();
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2;
    var bucketManager = new qiniu.rs.BucketManager(mac,config);
    return bucketManager;
}

app.use(router.routes());

app.listen(3001,function(){
    console.log('CORS-enabled web server listening on port 3001');
});
