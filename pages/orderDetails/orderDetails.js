const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    state:'',
    orderNumber:'',
    index:'',
    orderTime:'',
    list:{},
    show:true,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let index=options.index,
        state=options.state,
        orderNumber=options.orderNumber;
        this.setData({
          index:index,
          state:state,
          orderNumber:orderNumber
        })
    util.request(api.order3, { orderid: orderNumber, thr_session: app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      if (res.wuliu){
        res.wuliu.Traces.reverse()
      }
      this.setData({
        list:res
      })
      var that = this,
        intDiff = res.b,
        day = 0,
        hour = 0,
        minute = 0,
        second = 0,
        timer = setInterval(function () {

          if (intDiff > 0) { //转换时间
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            intDiff--;
            var str = hour + ':' + minute + ':' + second
            // console.log(str)    
          } else {
            var str = "已超过了有效时间！";
            that.data.show=false
            clearInterval(timer);
            util.request(api.order_del, { id: orderNumber, thr_session: app.globalData.loginState},"POST").then(res=>{
              wx.switchTab({
                url: '/pages/user/user',
              })
            })
          }
          that.setData({
            orderTime: str,
            show:that.data.show
          })
        }, 1000)
      
      this.setData({
        list:res
      })
    })
  },
  //取消
  cancel(e){
    console.log(e)
    let orderNumber=e.detail.ordernumber;
    util.request(api.order_del, { id: orderNumber, thr_session:app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      if(res.error==1){
        this.toast('取消成功')
      }else{
        this.toast1('取消失败')
      }
    })
  },
  //确认收货
  affirm(e){
    console.log(e)
    let orderNumber=e.detail;
    util.request(api.order_sure, { thr_session:app.globalData.loginState,id:orderNumber},"POST").then(res=>{
      console.log(e)
      this.toast('己经收货了')
    })
  },
  toast(title) {
    wx.showToast({
      title: title,
      mask: true,
      duration: 2000
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/orderManagement/orderManagement?state=7&sortIndex=0'
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