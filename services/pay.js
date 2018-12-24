/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(timeStamp, nonceStr, pack, signType, paySign) {
  return new Promise(function(resolve, reject) {
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr':nonceStr,
      'package': pack,
      'signType':signType,
      'paySign': paySign,
      'success': function(res) {
        resolve(res);
      },
      'fail': function(res) {
        reject(res);
      },
      'complete': function(res) {
        reject(res);
      }
    });
  })
}

module.exports = {
  payOrder
}