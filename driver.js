const Mango = require('./mango');

function getOne(id){
   return {
       _id: id,
        url: 'http://118.126.104.63/',
        tags: ['shenzhen','portrait'],
        title: '熊猫的傻笑',
        comment: '无言以对的绝对',
    }
}

var items = [
    getOne(1), getOne(2), getOne(3) 
]
// new Mango.AddOne(item);
// new Mango.AddMany(items);
new Mango.Find({'tags':'sh'});
new Mango.Find({'tags':new RegExp('sh')});