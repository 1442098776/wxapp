//index.js
//获取应用实例
const util=require('../../utils/util.js');
const api=require('../../config/api.js');
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay:true,
    interval: 5000,
    duration: 1000,
    img:'/static/images/bg.png',
    sort: [
      { id: 1,path:'/pages/groupList/groupList', url: '/static/images/group.png', text: '拼团' },
      { id: 2,path:'/pages/sort/sort', url: '/static/images/hot.png', text: '爆款' },
      { id: 3,path:'/pages/bale/bale', url: '/static/images/debris.png', text: '碎片' },
      { id: 4,path:'/pages/lottery/lottery', url: '/static/images/lottery.png', text: '抽奖' }
    ],
    count:{}
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    util.showNavigation(1000,'正在加载')
    util.request(api.index,{},"GET").then(res=>{
      console.log(res)
      this.setData({
        count:res
      })
    })
  },
  navigator1(){
    console.log('aaaa')
    wx.switchTab({
      url: '/pages/sort/sort'
    })
  },
  navigator2(){
    wx.switchTab({
      url: '/pages/bale/bale'
    })
  }
})
