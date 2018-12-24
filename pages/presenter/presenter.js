const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    show:true,
    user: '',
    id:'',
    list:{}
  },
  onLoad: function (options) {
    if (app.globalData.loginState == '') {
      app.loginModal()
    } else {
      console.log(options)
      var id = options.id,
        user = options.user;
      this.setData({
        user: user,
        id: id
      })
      if (user === app.globalData.loginState) {
        util.request(api.coupons4, { id: id, thr_session: app.globalData.loginState},"POST").then(res=>{
          console.log(res)
          this.setData({
            list:res
          })
        })
        this.setData({
          show: true
        })
      } else {
        console.log(options)
        let goods_name = options.goods_name,
          price=options.price,
          coupons=options.coupons,
          thr_session=options.user,
          thr_session1 = app.globalData.loginState,
          id=options.id,
          img=options.img;
        util.request(api.coupons2, { id:id, thr_session: thr_session, thr_session1: thr_session1},"POST").then(res=>{
          console.log(res)
          this.setData({
            list:res
          })
        })
        this.setData({
          show: false
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var that=this,
     goods_name = this.data.list.goods_name,
      price = this.data.list.price,
      coupons = this.data.list.coupons,
      img = this.data.list.img;
    if (options.from == 'button') {
      return {
        title: that.data.list.goods_name + '10元优惠券',
        desc: '',
        path: '/pages/presenter/presenter?goods_name=' + goods_name + '&price=' + price + '&coupons=' + coupons + '&img=' + img+'&user=' + app.globalData.loginState+'&id='+that.data.id,
        success: function (res) {
          if(res.errMsg=='shareAppMessage:ok'){
            console.log(that.data.list)
            wx.showToast({
              title: '赠送成功',
              mask:true,
              duration:500
            })
            console.log('赠关成功')
            console.log('thr_session:' + app.globalData.loginState + "-------" + 'id:' + that.data.id)
            util.request(api.coupons, { thr_session: app.globalData.loginState, id: that.data.id},"POST").then(msg=>{
              console.log(msg)
            }).catch(err=>{
              console.log('err:'+err)
            })
          }
        }
      }
    }
  },
  //点击领取
  getArch(){
    let thr_session=this.data.user,
        id=this.data.id;
    util.request(api.coupons3, { thr_session: thr_session, id: id, thr_session1:app.globalData.loginState}).then(res=>{
      console.log(res)
      wx.showModal({
        title: '领取成功',
        content: '已放入背包，可在购物时使用',
        showCancel: false,
        confirmText: '点击查看',
        success: function (msg) {
          console.log(msg)
          if (msg.confirm) {
            wx.switchTab({
              url: '/pages/bale/bale',
            })
          }
        }
      })
    })
  }
})