const api=require('../../config/api.js');
const util=require('../../utils/util.js');
const app = getApp();

Component({
  properties: {
    state:{
      type: Number,
      value:''
    },
    orderNumber:{
      type:String,
      value:''
    },
    index:{
      type:Number,
      value:''
    },
    oddNumber:{
      type: String,
      value: ''
    },
    show:{
      type:Boolean,
      value:true
    },
    tot:{
      type:Number,
      value:''
    }
  },
  data: {

  },
  methods: {
    //立即支付
    pay(e){
      console.log(e)
      let orderNumber=e.currentTarget.dataset.ordernumber,
          tot=e.currentTarget.dataset.tot,
          that=this;
      console.log(app.globalData.loginState)
      util.request(api.order_success1, { orderid: orderNumber, thr_session:app.globalData.loginState},"POST").then(res=>{
        console.log(res)
        var orderid=res.orderid;
        wx.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res) {
            console.log(res)
            if (res.errMsg == 'requestPayment:ok') {
              util.request(api.order_success2, { orderid: orderid, thr_session: app.globalData.loginState, tot: tot }, "POST").then(res => {
                console.log(res)
                if (res.error == 1) {
                  that.toast()
                } else {
                  that.toast1()
                }
              })
            }
          },
          'fail': function (err) {
            console.log(err)
          }
        })
      })
    },
    toast() {
      wx.showToast({
        title: '支付成功',
        mask: true,
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/orderManagement/orderManagement?state=7&sortIndex=0'
        })
      }, 2000)
    },
    toast1() {
      wx.showToast({
        title: '支付失败',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    },
    //取消
    cancel(e){
      console.log(e)
      let date=e.currentTarget.dataset,
          that=this;
      util.showModal('你确定要取消所选的订单吗?', true, '确定').then(res => {
        if(res){
          that.triggerEvent('cancel',date)
        }
      }).catch(err =>{
        console.log(err)
      })
    },
    //提醒发货
    shipments(e){
      console.log(e)
      let orderNumber=e.currentTarget.dataset.ordernumber;
         util.showModal('亲，已通知卖家尽快发货请您耐心等待', false, '知道了').then(res => {
          //  console.log(res)
         })
    },
    //确认收货
    affirm(e){
      let orderNumber=e.currentTarget.dataset.ordernumber,
          index=e.currentTarget.dataset.index,
          that=this;
          util.showModal('您确定当前已收到货物了吗?',true,'确定').then(res=>{
            if(res){
              // console.log(res)
              // util.request(api, { orderNumber: orderNumber, res: res, user_id: app.globalData.loginState,},"POST").then(msg=>{
              that.triggerEvent('affirm', orderNumber)
              // })
            }
          }).catch(err=>{
            console.log(err)
          })      
    },
    //申请退款
    refund(e) {
      console.log(e)
      let orderNumber=e.currentTarget.dataset.ordernumber;
      wx.navigateTo({
        url: '/pages/refund/refund?orderNumber='+orderNumber,
      })
    },
    //申请退货
    salesReturn(e){
      console.log(e)
      let orderNumber = e.currentTarget.dataset.ordernumber,
        text = e.currentTarget.dataset.text;
      wx.navigateTo({
        url: '/pages/salesReturn/salesReturn?orderNumber='+orderNumber+'&text='+text,
      })
    },
    //查看物流
    look(e) {
      console.log(e)
      let orderNumber=e.currentTarget.dataset.ordernumber,
        oddNumber = e.currentTarget.dataset.oddnumber;
        console.log(oddNumber)
      wx.navigateTo({
        url: '/pages/logistics/logistics?orderNumber=' + orderNumber + '&oddNumber=' + oddNumber,
      })
    },
    //评价
    evaluate(e){
      console.log(e)
      let orderNumber=e.currentTarget.dataset.ordernumber,
          text=e.currentTarget.dataset.text;
        wx:wx.navigateTo({
          url: '/pages/evaluate/evaluate?orderNumber='+orderNumber+'&text='+text
        })
    },
    remove(e) {
      // console.log(e)
      let date = e.currentTarget.dataset,
        that = this;
      wx.showModal({
        title: '确定要删除订单？',
        content: '删除之后不可以恢复订单数据',
        success: function (e) {
          // console.log(e)
          if (e.confirm) {
            that.triggerEvent('remove', date)
          }
        }
      })
    }
  } 
})
