const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({
  data: {
    height:'',
    indexGrade:0,
    flag: true, //滚到底部开启
    page: 0, //页数
    id:0,
      title: [
        { id: 0, text: '全部评价' }
        // { id: 0, text: '全部评价' },
        // { id: 1, text: '好评' },
        // { id: 2, text: '中评' },
        // { id: 3, text: '差评' }
      ],
      evaluate: [],
  },
  onLoad: function (options) {
    var that = this,
    id=options.id;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.setData({
      id:id
    })
    this.requestDate()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //图片预览
  previewImage(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index,
      index1 = e.currentTarget.dataset.index1,
      urls = this.data.evaluate[index].img,
      current = this.data.evaluate[index].img[index1];
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },
  //点击头部类别
  // grade(e) {
  //   let index = e.currentTarget.dataset.index,
  //     id= e.currentTarget.dataset.id,
  //     that = this;
  //   this.setData({
  //     indexGrade: index,
  //     id: id
  //   })
  //   util.request(api, {
  //     id: id
  //   }, "POST").then(res => {
  //     that.data.list.evaluate=res
  //     that.setData({
  //       list: that.data.list
  //     })
  //   })
  // },
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
    util.request(api.comment3, {
      page: this.data.page,
      limit: '10',
      id: this.data.id
    }, "POST").then(res => {
      console.log(res)
      if(res.status==1){
        if (res.length < 10) {
          f = false
        } else {
          f = true
        }
        var evaluate = that.data.evaluate.concat(res.com)
        var page = ++this.data.page
        that.setData({
          evaluate: evaluate,
          page: page,
          flag: f
        })
      }
    })
  },
})