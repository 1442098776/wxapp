const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const userInfo = require('../../services/userInfo.js');
const app = getApp()

Page({
  data: {
    burseCount:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: null,
    popup: false,
    week:['周一','周二','周三','周四','周五','周六','周日'],
    day: new Date().getUTCDay(),
    signIn:{
      jifen:50,
      msg:'',
      zongjifen:240,
      status: 0,
    },
    url: ['/pages/orderManagement/orderManagement', '/pages/orderManagement/orderManagement', '/pages/orderManagement/orderManagement', '/pages/orderManagement/orderManagement','/pages/salesService/salesService'],
    list: {
      signIn:true,
      fans: 0,
      fans1: 0,
      arr: [
        { id: 1, state: 1, name: '待付款', sortIndex:1, num: 8, img: '/static/images/3.png' },
        { id: 2, state: 2, name: '待成团', sortIndex:2,num: 8, img: '/static/images/4.png' },
        { id: 3, state: 3, name: '待发货', sortIndex:3,num: 8, img: '/static/images/5.png' },
        { id: 4, state: 4, name: '待收货', sortIndex:4,num: 8, img: '/static/images/6.png' },
        { id: 5, state: '', name: '退款/售后', sortIndex: 6, num: 8, img: '/static/images/7.png' },
      ]
    },
    status:'',
    num: [],
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(public.Encrypt('你他妈的'))
    // console.log(public.Decrypt('这是解密的字符串'))

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      util.getUserInfo().then(res => {
        app.globalData.userInfo = res
        this.setData({
          userInfo: res,
          hasUserInfo: true
        })
      })
    }
  },
  onShow: function (options){
    if (app.globalData.loginState){
      // this.userLogin()
      util.request(api.member, { thr_session: app.globalData.loginState }, "POST").then(res => {
        console.log(res)
        
        this.setData({
          money:res.money,
          num:res.num,
          status:res.status
        })
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo(e) {
    console.log(e)
    var that=this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          util.showNavigation(2000,'正在登录')
          that.userLogin();
        }else{ 
          console.log('bbb')
          wx.openSetting({
            success: function (res) {
              that.userLogin()
            }
          })
          that.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },
  userLogin(){
    userInfo.loginByWeixin().then(msg => {
      console.log(msg)
      app.globalData.userInfo = msg.user
      app.globalData.loginState = msg.user.thr_session
      this.setData({
        userInfo: msg.user,
        hasUserInfo: true,
        money:msg.money,
        status:msg.status,
        num:msg.num
      })
    })
  },
  //关团签到
  close(){
    this.data.popup=false;
    this.setData({
      popup: this.data.popup
    })
  },
  popupShow(){
    let that=this;
    util.request(api.signin, { thr_session:app.globalData.loginState},"POST").then(res=>{
      if(res.status==1){
        this.setData({
          popup:true,
          signIn:res
        })
      }
      console.log(res)
    })
  },
  //查看钱包帮助弹窗
  bursePopup(){
    this.setData({
      burseCount:false
    })
  },
  //关闭钱包帮助弹窗
  burseClose(){
    this.setData({
      burseCount: true
    })
  },
  //提现
  Withdraw(){
    wx.navigateTo({
      url: '/pages/Withdraw/Withdraw',
    })
  }
})