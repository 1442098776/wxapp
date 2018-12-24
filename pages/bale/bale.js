const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({

  data: {
    chipCount:true,    //是否显示碎片帮助
    hidden:true,
    hidden1:true,
    user:'',
    isAllSelect: false,
    totalMoney: 0,
    conversion: false,     //兑换弹窗是否显示
    id:'',
    bale: {
      suipian: [],
      youhui: [],
    },
    goodsConversion: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('goods')
    wx.removeStorageSync('state')
    if (app.globalData.loginState == '') {
      app.loginModal()
    } else {
      this.requestDate();
      this.setData({
        user: app.globalData.loginState,
        totalMoney:0,
        isAllSelect:false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestDate() {
    var that = this;
    util.request(api.cart, { thr_session: app.globalData.loginState }, "POST").then(res => {
      console.log(res)
      if (res.suipian != 0) {
        this.data.bale.suipian = res.suipian
      }
      if (res.youhui != 0) {
        this.data.bale.youhui = res.youhui
      }
      that.setData({
        bale: this.data.bale
      })
    })
  },
  //查看碎片帮助弹窗
  chipPopup(){
    this.setData({
      chipCount:false,
      hidden:false
    })
  },
  //关闭碎片帮助弹窗
  chipClose(){
    this.setData({
      chipCount: true,
      hidden:true
    })
  },
  //查看优惠券帮助弹窗
  archPopup(){
    this.setData({
      chipCount:false,
      hidden1:false
    })
  },
  //关闭优惠券帮助弹窗
  archClose() {
    this.setData({
      chipCount:true,
      hidden1:true
    })
  },
  //选择
  switchSelect(e) {
    // console.log(e)
    var Allprice = 0,
      debrisesPrice=0,
      j = 0;
    let index = e.target.dataset.index;
    //价格统计
    if (this.data.bale.suipian[index].status == 1) {
      this.data.bale.suipian[index].status=0
    }else{
      this.data.bale.suipian[index].status=1
    }
    //拥有的碎片超过时，只能兑换最多肯定的值
    if (this.data.bale.suipian[index].debrises > this.data.bale.suipian[index].debrises_num){
      debrisesPrice = this.data.bale.suipian[index].debrises_num
    }else{
      debrisesPrice = this.data.bale.suipian[index].debrises
    }
    if (this.data.bale.suipian[index].status == 1) {
      this.data.totalMoney = this.data.totalMoney + (this.data.bale.suipian[index].price * this.data.bale.suipian[index].num) - parseInt(debrisesPrice * 0.05) - this.data.bale.suipian[index].cprice
    } else {
      this.data.totalMoney = this.data.totalMoney - (this.data.bale.suipian[index].price * this.data.bale.suipian[index].num) + parseInt(debrisesPrice * 0.05) + this.data.bale.suipian[index].cprice
    }
    //是否全选判断
    for (j = 0; j < this.data.bale.suipian.length; j++) {
      Allprice+=this.data.bale.suipian[j].status
      if (Allprice == this.data.bale.suipian.length) {
        this.data.isAllSelect = true;
      } else {
        this.data.isAllSelect = false;
      }
    }
    this.setData({
      bale: this.data.bale,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect
    })
  },
  //全选
  allSelect(e) {
    var debrisesPrice = 0;
    let i = 0;
    //拥有的碎片超过时，只能兑换最多肯定的值
    if (!this.data.isAllSelect) {
      for (i = 0; i < this.data.bale.suipian.length; i++) {
        if (this.data.bale.suipian[i].status == 0) {
          this.data.bale.suipian[i].status = 1;
          if (this.data.bale.suipian[i].debrises > this.data.bale.suipian[i].debrises_num) {
            debrisesPrice = this.data.bale.suipian[i].debrises_num
          } else {
            debrisesPrice = this.data.bale.suipian[i].debrises
          }
          this.data.totalMoney = this.data.totalMoney + (this.data.bale.suipian[i].price * this.data.bale.suipian[i].num) - parseInt(debrisesPrice * 0.05) - this.data.bale.suipian[i].cprice
        }
      }
    } else {
      for (i = 0; i < this.data.bale.suipian.length; i++) {
        this.data.bale.suipian[i].status = 0;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      bale: this.data.bale,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney
    })
  },
  //数量减
  subtract(e) {
    let index = e.target.dataset.index;
    if (this.data.bale.suipian[index].num > 1) {
      this.data.bale.suipian[index].num = this.data.bale.suipian[index].num - 1
      if (this.data.bale.suipian[index].status == 1) {
        this.data.totalMoney = this.data.totalMoney - this.data.bale.suipian[index].price
      }
      this.setData({
        bale: this.data.bale,
        totalMoney: this.data.totalMoney
      })
    }
  },
  //数量加
  add(e) {
    let index = e.target.dataset.index;
    this.data.bale.suipian[index].num = this.data.bale.suipian[index].num + 1
    if (this.data.bale.suipian[index].status == 1) {
      this.data.totalMoney = this.data.totalMoney + this.data.bale.suipian[index].price
    }
    this.setData({
      bale: this.data.bale,
      totalMoney: this.data.totalMoney
    })
  },
  //结算
  total(e) {
    console.log(e)
    if (this.data.totalMoney==0){
      return
    }
    let arr = this.data.bale.suipian.filter((item, i) => {
        if (item.status == 1) {
          return item;
        }
      })
    console.log(arr)
    wx.setStorageSync('goods', arr)
    wx.setStorageSync('state', '')
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  //兑换优惠券
  conversion(e) {
    console.log(e)

    let id = e.currentTarget.dataset.id,
      that = this;
    util.request(api.debrises1, { id: id, thr_session: app.globalData.loginState }, "POST").then(res => {
      console.log(res)
      that.setData({
        conversion: true,
        goodsConversion:res
      })
    }).catch(err => {})
  },
  //关团弹窗
  close() {
    this.setData({
      conversion: false
    })
  },
  //确认况换
  submit(e) {
    console.log(e)
    var that = this;
    this.setData({
      conversion: false
    })
    util.request(api.debrises, { id: this.data.goodsConversion.id, thr_session: app.globalData.loginState }, "POST").then(res => {
      console.log(res)
      if(res.error===1){
        wx.showModal({
          title: '兑换成功',
          content: '可在购物时使用，或赠送好友',
          showCancel: false,
          success: function (msg) {
            console.log(msg)
            if (msg.confirm) {
              that.requestDate()
            }
          }
        })
      }
    })
  }
})