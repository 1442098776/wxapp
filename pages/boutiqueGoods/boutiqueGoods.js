const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    height: '',
    flag: true, //滚到底部开启
    page: 1, //页数
    list: [
      { id: 1, url: '/static/images/330.png', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 2, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 3, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 4, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 5, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 6, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 7, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' },
      { id: 8, url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', name: 'VAV-006玫瑰金卷发器', price: '120.0', debris: '60', count: '2400' }
    ]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.requestDate()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //滚到底部时加载
  lower(e) {
    console.log(e)
    if (this.data.flag) {
      this.requestDate()
    }
  },
  //请求数据
  requestDate() {
    this.setData({
      flag: false
    })
    var that = this,
      f;
    util.request(api, {
      page: this.data.page,
      catid: '20',
      id: this.data.id
    }, "GET").then(res => {
      if (res.length < 20) {
        f = false
      } else {
        f = true
      }
      var list = that.data.list.concat(res)
      var page = ++this.data.page
      that.setData({
        list: list,
        page: page,
        flag: f
      })
    })
  },
})