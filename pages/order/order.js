const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({
  data: {
    shareUser: '',    //分销用户
    address: false,
    // btnNum:false,
    disabled: false,
    totalNum: 0,
    totalMoney: 0,
    colorIndex: 0,
    status:'',   //开团状态 1是团长 0是团员
    state: '',   //state状态 1为拼团订单   空为普通和背包里的订单
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var shareUser;
    if (options.shareUser != undefined) {
      shareUser = options.shareUser
    } else {
      shareUser = ''
    }
    var goods = wx.getStorageSync('goods'),
       state = wx.getStorageSync('state');
    this.setData({
      state: state,
      shareUser: shareUser
    })
    console.log(app.globalData.loginState)
    if (state != 1) {
      util.request(api.order, { thr_session: app.globalData.loginState, goods: goods }, "POST").then(res => {
        console.log(res)
        res.goods.forEach((item, i) => {
          this.data.totalMoney = this.data.totalMoney + parseInt(item.price * item.num) - parseFloat(item.suipian) - parseInt(item.youhuiquan) - parseInt(item.yunfei);
          this.data.totalNum += item.num
        })
        this.setData({
          list: res,
          totalMoney: this.data.totalMoney,
          totalNum: this.data.totalNum
        })
      })
    } else {
      var status = wx.getStorageSync('status');
      util.request(api.order1, { thr_session: app.globalData.loginState, goods: goods }, "POST").then(res => {
        console.log(res)
        res.goods.forEach((item, i) => {
          this.data.totalMoney = this.data.totalMoney + parseInt(item.price * item.num) - parseFloat(item.suipian) - parseInt(item.youhuiquan) - parseInt(item.yunfei);
          this.data.totalNum += item.num
        })
        this.setData({
          list: res,
          totalMoney: this.data.totalMoney,
          totalNum: this.data.totalNum,
          status: status
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //减数量
  subtract(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index;
    if (this.data.list.goods[index].num != 1) {
      this.data.list.goods[index].num = this.data.list.goods[index].num - 1;
      this.data.totalNum = this.data.totalNum - 1;
      this.data.totalMoney = this.data.totalMoney - parseInt(this.data.list.goods[index].price);
    } else {
      this.setData({
        disabled: true
      })
    }
    this.setData({
      totalMoney: this.data.totalMoney,
      list: this.data.list,
      totalNum: this.data.totalNum
    })
  },
  // 选择颜色
  colorCheck(e) {
    let index0 = e.currentTarget.dataset.index0,
      index = e.currentTarget.dataset.index;
    this.data.list.goods[index0].colorSelect = this.data.list.goods[index0].color[index]
    this.setData({
      list: this.data.list,
      colorIndex: index
    })
  },
  //加数量
  add(e) {
    let index = e.currentTarget.dataset.index;
    this.data.list.goods[index].num = this.data.list.goods[index].num + 1;
    this.data.totalNum = this.data.totalNum + 1;
    this.data.totalMoney = this.data.totalMoney + parseInt(this.data.list.goods[index].price);
    if (this.data.list.goods[index].num > 1) {
      this.setData({
        disabled: false
      })
    }
    this.setData({
      totalNum: this.data.totalNum,
      totalMoney: this.data.totalMoney,
      list: this.data.list
    })
  },
  //付款
  startPay(e) {
    console.log(e)
    var shareUser = e.currentTarget.dataset.shareuser,
      that = this,
      list = this.data.list;
    if (list.address == 0) {
      wx.showToast({
        title: '收货地址不能为空！',
        duration: 2000,
        mask: true
      })
    } else {
      if (this.data.state != 1) {
        util.request(api.order_pay, { goods: list.goods, thr_session: app.globalData.loginState, address: list.address, tot: this.data.totalMoney }, "POST").then(res => {
          let orderid = res.orderid;
          console.log(res)
          wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.package,
            'signType': res.signType,
            'paySign': res.paySign,
            'success': function (res) {
              console.log(res)
              if (res.errMsg == 'requestPayment:ok') {
                util.request(api.order_success, { orderid: orderid, thr_session: app.globalData.loginState, tot: that.data.totalMoney }, "POST").then(res => {
                  console.log(res)
                  if (res.error == 1) {
                    let shareUser = that.data.shareUser;
                    if (shareUser!=''){
                      util.request(api.share4, { thr_session1: shareUser, orderid: orderid, style: pt1},"POST").then(res=>{
                        console.log(e)
                        that.toast('支付成功得佣金')
                      })
                    }else{
                      that.toast('支付成功')
                    }
                    
                  } else {
                    that.toast1('支付失败')
                  }
                })
              }
            },
            'fail': function (err) {
              console.log(err)
            }
          })
        })
      }else{
        util.request(api.pt_order, { goods: list.goods, thr_session: app.globalData.loginState, address: list.address, tot: this.data.totalMoney, status: this.data.status }, "POST").then(res => {
          let orderid = res.orderid;
          console.log(res)
          wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.package,
            'signType': res.signType,
            'paySign': res.paySign,
            'success': function (res) {
              console.log(res)
              if (res.errMsg == 'requestPayment:ok') {
                console.log(orderid)
                console.log(app.globalData.loginState)
                util.request(api.pt_success, { orderid: orderid, thr_session: app.globalData.loginState, tot: that.data.totalMoney }, "POST").then(res => {
                  console.log(res)
                  if (res.error == 1) {
                    let shareUser = that.data.shareUser;
                    if (shareUser != '') {
                      util.request(api.share4, { thr_session1: shareUser, orderid: orderid, style: pt }, "POST").then(res => {
                        console.log(e)
                        that.toast('支付成功得佣金')
                      })
                    } else {
                      that.toast('支付成功')
                    }
                  } else {
                    that.toast1('支付失败')
                  }
                })
              }
            },
            'fail': function (err) {
              console.log(err)
            }
          })
        })
      }
    }
  },
  toast(title) {
    wx.showToast({
      title: title,
      mask: true,
      duration: 2000
    })
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/user/user'
      })
    }, 2000)
  },
  toast1(title) {
    wx.showToast({
      title: title,
      mask: true,
      icon: 'none',
      duration: 2000
    })
  }
})