const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    applyState:0,
    tapIndex:0,
    textareaValue:'',
    list:{},
    orderNumber:''
  },
  onLoad: function (options) {
    console.log(options)
    let orderNumber=options.orderNumber;
    this.setData({
      orderNumber:orderNumber
    })
    if (app.globalData.loginState == '') {
      app.loginModal()
    } else {
      util.request(api.order_refund, { id: orderNumber, thr_session:app.globalData.loginState},"POST").then(res=>{
        console.log(res)
        this.setData({
          list:res
        })
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //原因
  check(e){
    let index=e.detail.value;
    this.setData({
      tapIndex:index
    })
  },
  //说明
  inputValue(e){
    let value=e.detail.value;
    this.setData({
      textareaValue:value
    })
  },
  //提交
  submit(e) {
    let orderNumber = this.data.orderNumber,
      cause = this.data.list.aa[this.data.tapIndex],
      value = this.data.textareaValue;
    util.request(api.order_refund1, { id: orderNumber,om:this.data.list.order_money, why: cause, because: value, thr_session: app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      this.setData({
        list:res
      })
    })
  },
  //修改申请
  change(e){
    util.request(api.order_refund_edit, { refund_num: this.data.list.refund_num, thr_session:app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      res.status=0
      var n=res.aa.findIndex((item,i)=>{
        if(item==res.why){
          return true
        }
      })
      this.setData({
        list:res,
        tapIndex:n,
        textareaValue:res.because        
      })

    })
  }
  //取消申请
  // cancel(){
  //   let refund_num = this.data.list.refund_num;
  //   util.request(api.order_refund_del, { refund_num: refund_num, thr_session:app.globalData.loginState},"POST").then(res=>{
  //     console.log(res)
  //     wx.navigateTo({
  //       url: '/pages/orderManagement/orderManagement',
  //     })
  //   })
  // }
})