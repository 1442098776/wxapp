//app.js
const api = require('./config/api.js');
const util = require('./utils/util.js');
const userInfo = require('./services/userInfo.js');
App({

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取登录状态
    var loginState = wx.getStorageSync('loginState')
    var user = wx.getStorageSync('userInfo')
    this.globalData.userInfo = user
    this.globalData.loginState = loginState

    userInfo.checkLogin().then(res => {
      if (res == false) {
        this.globalData.userInfo = null
        this.globalData.loginState = ''
        console.log(res)
        this.loginModal()
      }
    }).catch(err => {
    })
  },
  globalData: {
    userInfo: null,
    loginState:''
  },
  //检查登录过期后跳转
  loginModal() {
    wx.showModal({
      content: '请用户登录！',
      cancelText:'返回首页',
      confirmText:'去登录',
      success: function (res) {
        wx.clearStorageSync()
        if (res.confirm == true) {
          wx.switchTab({
            url: '/pages/user/user'
          })
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      },
      fail: function (err) {

      }
    })
  }
})