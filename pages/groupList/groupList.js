const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    height:'',
    list:[]
  },
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    util.request(api.pt_index,{},"GET").then(res=>{
      console.log(res)
      this.setData({
        list:res.pintuan
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})