const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let orderNumber=options.orderNumber,
      oddNumber = options.oddNumber;
    util.request(api.logistics, { orderid: orderNumber, code: oddNumber, thr_session: app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      res.Traces.reverse()
      this.setData({
        list:res
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})