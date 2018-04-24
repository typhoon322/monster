/* eslint-disable prefer-promise-reject-errors */

// const baseUrl = 'rs.qbox.me';

const accessKey = 'dAOpc1T8ihf_VRb2iimYotUQI9VPY0Gkcj_1S9gI';
const secretKey = 'z5WxFhMk23E1gXlExhkG66AxjGyAmF_PUbYzjP6W';
const scopeName = 'panda';

const timeoutErr = {
  code: 1,
  msg: '请求超时',
};
const catchErr = {
  code: 1,
  msg: '网络异常',
};

const timeOut = 15;
const requestHeaders = {
  'Accept': 'application/json',
  // 'Content-Type': 'application/json',
};

function timerPromisefy(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeoutErr);
    }, delay * 1000);
  });
}

var qiniu = require('qiniu');

function getMac(){
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  console.log('mac : '+mac);
  return mac;
}

function AsyncUtil() {

this.fetchUploadToken = function() {
  var mac = getMac();
  var options = {
      scope: scopeName,
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken=putPolicy.uploadToken(mac);
  console.log(uploadToken);
  return uploadToken;
},

this.getToken = function(){
  return {"UpToken": fetchUploadToken()};
}

// this.doPostForm = function(path, formData) {
//   return Promise.race([
//     timerPromisefy(timeOut),
//     new Promise((resolve, reject) => {
//       fetch(`${baseUrl}${path}`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           // 'Content-Type': 'application/json',
//           // 'Content-Type': 'multipart/form-data',
//           // ...(getToken() && { 'X-User-Token': getToken() }),
//         },
//         credentials: 'include',
//         body: formData,
//       }).then(response => response.json(),
//       ).then((json) => {
//         resolve(json);
//       }).catch((err) => {
//         reject(catchErr);
//       });
//     }),
//   ]).then(value => value).catch(err => err);
// },

// this.doPost = function(path, data) {
//   return Promise.race([
//     timerPromisefy(timeOut),
//     new Promise((resolve, reject) => {
//       fetch(`${baseUrl}${path}`, {
//         method: 'POST',
//         headers: {
//           ...requestHeaders,
//           // ...(getToken() && { 'X-User-Token': getToken() }),
//         },
//         credentials: 'include',
//         body: JSON.stringify(data),
//       }).then(response => response.json(),
//       ).then((json) => {
//         resolve(json);
//       }).catch((err) => {
//         reject(catchErr);
//       });
//     }),
//   ]).then(value => value).catch(err => err);
// },

// this.doPut = function(path, data) {
//   return Promise.race([
//     timerPromisefy(timeOut),
//     new Promise((resolve, reject) => {
//       fetch(`${baseUrl}${path}`, {
//         method: 'PUT',
//         headers: {
//           ...requestHeaders,
//           ...{ 'X-User-Token': getToken() },
//         },
//         credentials: 'include',
//         body: JSON.stringify(data),
//       }).then(response => response.json(),
//       ).then((json) => {
//         resolve(json);
//       }).catch((err) => {
//         reject(catchErr);
//       });
//     }),
//   ]).then(value => value).catch(err => err);
// },

// this.doGet = function(path) {
//   return Promise.race([
//     timerPromisefy(timeOut),
//     new Promise((resolve, reject) => {
//       fetch(`${baseUrl}${path}`, {
//         method: 'GET',
//         headers: {
//           ...requestHeaders,
//           'Content-Type': 'application/x-www-form-urlencoded',
//           // ...(getToken() && { 'X-User-Token': getToken() }),
//         },
//         credentials: 'include',
//       }).then(response => response.json(),
//       ).then((json) => {
//         resolve(json);
//       }).catch((err) => {
//         reject(catchErr);
//       });
//     }),
//   ]).then(value => value).catch(err => err);
// }

};

module.exports = AsyncUtil;

