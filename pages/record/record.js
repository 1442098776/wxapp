const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()

Page({
  data: {
    height:'',
    flag: true, //滚到底部开启
    page: 1, //页数
    list:[
      {id:0,price:60.0,time:'2020-10-20',state:'已完成'},
      { id: 1, price: 10.0, time: '2020-10-20', state: '已完成' },
      { id: 2, price: 30.0, time: '2020-10-20', state: '提现中' },
      { id: 3, price: 20.0, time: '2020-10-20', state: '已完成' },
      { id: 4, price: 70.0, time: '2020-10-20', state: '已完成' }
    ]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.requestDate()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //滚到底部时加载
  lower(e) {
    console.log(e)
    if (this.data.flag) {
      this.requestDate()
    }
  },
  //请求数据
  requestDate() {
    this.setData({
      flag: false
    })
    var that = this,
      f;
    util.request(api, {
      page: this.data.page,
      catid: '20',
      user_id: app.globalData.loginState
    }, "GET").then(res => {
      if (res.length < 20) {
        f = false
      } else {
        f = true
      }
      var list = that.data.list.concat(res)
      var page = ++this.data.page
      that.setData({
        list: list,
        page: page,
        flag: f
      })
    })
  },
})