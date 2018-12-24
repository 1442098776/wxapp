const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()

Page({
  data: {
    value:'',
    popup:false,
    show:true,
    success:false,
    list:{}
  },
  onLoad: function (options) {
    if(app.globalData.loginState!=''){
      util.request(api.member1, { thr_session:app.globalData.loginState},"POST").then(res=>{
        console.log(res)
        this.setData({
          list:res
        })
      })
    }else{
      util.showModal('请先登录!',true,'确定').then(res=>{
        if(res){
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      }).catch(err=>{
        if(err==false){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //输入金额
  inputValue(e){
    this.data.value=0
    this.data.value = e.detail.value;
    this.setData({
      value: this.data.value
    })
  },
  //我要提现
  Withdraw(){
    this.setData({
      popup:true,
      show:true
    })
  },
  //确认提现
  submit(e){
    console.log(e)
    if(this.data.tixian<50){
      return
    }
    var tixian=e.currentTarget.dataset.tixian;
    if(tixian){
      console.log(tixian)
      this.data.value=tixian
      this.setData({
        value:this.data.value,
        popup:true
      })
    }
    var value = this.data.value;
    if(value=='' || value==0){
      wx.showToast({
        title: '请输入提现金额!',
        icon:'none',
        duration:1000,
        mask:true
      })
    }else{
      if(value<=this.data.list.tixian){
        util.request(api.member2, { money: this.data.value, thr_session: app.globalData.loginState},"POST").then(res=>{
          console.log(res)
          if(res.error==1){
            this.setTimeOut()
            this.setData({
              show: false,
              success: true
            })
          }else{
            this.setData({
              show: false,
              success: false
            })
            this.setTimeOut()
          }
        })
      }else{
        this.setData({
          show:false,
          success:false
        })
        this.setTimeOut()
      }
    }
  },
  setTimeOut(){
    var that=this;
    setTimeout(function () {
      // that.setData({
      //   popup: false,
      //   show: true,
      //   success: false,
      //   value:''
      // })
      wx.navigateTo({
        url: '/pages/Withdraw/Withdraw',
      })
    }, 2000)
  }
})