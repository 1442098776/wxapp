const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    height: '',
    sortIndex: 0,
    indexTap:0,
    flag: true, //滚到底部开启
    page: 0, //页数
    //订单状态,1为待付款,2为待成团，3为待发货，4为待收货，5为待评价
    state: 7,

    sort: [{
        id: 0,
        text: '全部',
        state: 7
      },
      {
        id: 1,
        text: '待付款',
        state: 1
      },
      {
        id: 2,
        text: '待成团',
        state: 2
      },
      {
        id: 3,
        text: '待发货',
        state: 3
      },
      {
        id: 4,
        text: '待收货',
        state: 4
      },
      {
        id: 5,
        text: '待评价',
        state: 5
      }
    ],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let state = options.state,
      sortIndex = options.sortIndex;
    console.log(state)
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    if (app.globalData.loginState == '') {
      app.loginModal()
    } else {
      this.setData({
        state:state,
        sortIndex: sortIndex
      })
      this.requestDate();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击头部的分类
  sort(e) {
    let index = e.currentTarget.dataset.index,
      state = e.currentTarget.dataset.state,
      that = this;
      this.data.state=state
    this.setData({
      sortIndex: index,
      state:state,
      indexTap:index
    })
    that.requestDate1();
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
    util.request(api.order_all, {
      page: this.data.page,
      limit: '5',
      id: this.data.state,
      thr_session: app.globalData.loginState
    }, "POST").then(res => {
      console.log(res)
      if(res.error==1){
        if (res.length < 5) {
          f = false
        } else {
          f = true
        }
        var list = that.data.list.concat(res.list)
        var page = ++this.data.page
        that.setData({
          list: list,
          page: page,
          flag: f
        })
      }
    })
  },
  requestDate1() {
    this.setData({
      flag: false,
      list:[],
      page:0
    })
    var that = this,
      f;
    util.request(api.order_all, {
      page: this.data.page,
      limit: '5',
      id: this.data.state,
      thr_session: app.globalData.loginState
    }, "POST").then(res => {
      console.log(res)
      if (res.error == 1) {
        if (res.length < 5) {
          f = false
        } else {
          f = true
        }
        var page = ++this.data.page
        that.data.list = res.list
        that.setData({
          list:that.data.list,
          page: page,
          flag: f
        })
      }
    })
  },
  //取消
  cancel(e) {
    console.log(e)
    var index = e.detail.index,
      orderNumber = e.detail.ordernumber,
      that = this;
    util.request(api.order_del, {
      id: orderNumber,
      thr_session: app.globalData.loginState,
    }, "POST").then(res => {
      console.log(res)
      if(res.error==1){
        that.data.list.splice(index, 1)
        that.setData({
          list: that.data.list
        })
        that.toast('删除成功','success',1000)
      }else{
        that.toast('删除失败', 'none', 1000)
      }       
    })
  },
  //提醒弹窗方法
  toast(title,icon,time){
    wx.showToast({
      title: title,
      icon: icon,
      duration: time,
      success: function () { }
    })
  },
  //确认收货
  affirm(e) {
    console.log(e)
    let orderNumber = e.detail,
      that = this;
    this.setData({
      flag: false
    })
    var f;
    util.request(api.order_sure, {
      thr_session: app.globalData.loginState,
      id:orderNumber
    }, "POST").then(res => {
      that.requestDate1()
      that.setData({
        sortInde: that.data.indexTap
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  //删除订单
  remove(e){
    console.log(e)
    let index=e.detail.index,
        orderNumber=e.detail.ordernumber,
        that=this;
    util.request(api.order_del, {
      id: orderNumber,
      thr_session: app.globalData.loginState,
    }, "POST").then(res => {
      console.log(res)
      if (res.error == 1) {
        that.data.list.splice(index, 1)
        that.setData({
          list: that.data.list
        })
        that.toast('删除成功', 'success', 1000)
      } else {
        that.toast('删除失败', 'none', 1000)
      }
    })
  }
})