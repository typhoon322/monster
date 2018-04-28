import jwt from 'jwt-simple';

let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

if(token){
    ctx.response.body = {code: -1, msg: 'Invalid Token'};
    return;
}
var decoded = jwt.decode(token, secretKey);

if(token.expiresIn <= Date.now()){
    ctx.response.body = {code: -1, msg: 'Invalid Token'};
    return;
}