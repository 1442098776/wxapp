const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    height: '',
    sortIndex: 0,
    flag: true, //滚到底部开启
    page: 0, //页数
    //订单状态,1为待付款,2为待成团，3为待发货，4为待收货，5为待评价
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    if (app.globalData.loginState == '') {
      app.loginModal()
    } else {
      this.requestDate();
    }

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
    util.request(api.order2, {
      page: this.data.page,
      limit: '5',
      thr_session: app.globalData.loginState
    }, "POST").then(res => {
      console.log(res)
      if(res.error==1){
        if (res.length < 5) {
          f = false
        } else {
          f = true
        }
        var list = that.data.list.concat(res.list)
        var page = ++this.data.page
        that.setData({
          list: list,
          page: page,
          flag: f
        })
      }
    })
  },
  //取消申请
  // cancel(e) {
  //   console.log(e)
  //   var index = e.currentTarget.dataset.index,
  //     orderNumber = e.currentTarget.dataset.ordernumber,
  //     that = this;
  //   util.request(api, {
  //     orderNumber: orderNumber,
  //     user_id: app.globalData.loginState,
  //   }, "POST").then(res => {
  //     if (res.errno === 0) {
  //       that.data.list.splice(index, 1)
  //       that.setData({
  //         list: that.data.list
  //       })
  //     }
  //   })
  // },
  //查看详情
  look(e){
    console.log(e)
    let orderNumber=e.currentTarget.dataset.ordernumber,
        style=e.currentTarget.dataset.style;
        if(style==5){
          wx.navigateTo({
            url: '/pages/refund/refund?orderNumber=' + orderNumber
          })
        }else{
          wx.navigateTo({
            url: '/pages/salesReturn/salesReturn?orderNumber=' + orderNumber
          })
        }
    
  }
})