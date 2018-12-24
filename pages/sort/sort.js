const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    sortIndex: 0,
    h: '',
    id: '',
    content: {}
  },
  onLoad: function(options) {
    var that=this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          h:res.windowHeight
        })
      },
    })
    util.showNavigation(1000, '正在加载')
    var that = this;
    util.request(api.sort,{}, "GET").then(res => {
      that.setData({
        content: res
      })
      console.log(res)
    }).catch(err=>{})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  scroll(e) {
    console.log(e)
    this.setData({
      id: e.currentTarget.dataset.id,
      sortIndex: e.currentTarget.dataset.index
    })
    let id = e.currentTarget.dataset.id;
    util.request(api.cate, {
      id: id
    }, "POST").then(res => {
      console.log(res)
      this.data.content.goods=res.goods
      this.setData({
        content: this.data.content
      })
    }).catch(err=>{})
  }
})