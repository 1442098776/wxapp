const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    id: '',
    state: '',  //拼团详情
    shareUser: '',    //分享的用户
    time: '',
    autoplay: true,
    interval: 4000,
    duration: 1000,
    popup: false,
    hint: [{
      img: '/static/images/heart.png',
      text: '自营电商'
    },
    {
      img: '/static/images/heart.png',
      text: '正品保证'
    },
    {
      img: '/static/images/heart.png',
      text: '七天退换'
    },
    {
      img: '/static/images/heart.png',
      text: '全场包邮'
    }
    ],
    list: {}
  },
  onLoad: function (options) {
    console.log(options)
    var user_id = app.globalData.loginState;
    if (user_id != '') {
      wx.removeStorageSync('goods')
      wx.removeStorageSync('state')
      wx.removeStorageSync('status')
      var shareUser = options.user_id,
        id = options.id;
      this.setData({
        id: id
      })
      console.log(id)
      if (options.state == 1) {
        this.setData({
          state: options.state
        })
        util.request(api.pt_index1, { id: id }, "GET").then(res => {
          console.log(res)
          var that = this,
            intDiff = res.time,
            day = 0,
            hour = 0,
            minute = 0,
            second = 0,
            timer = setInterval(function () {

              if (intDiff > 0) { //转换时间
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                if (hour <= 9) hour = '0' + hour;
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                intDiff--;
                var str = hour + ':' + minute + ':' + second
                // console.log(str)    
              } else {
                var str = "已结束！";
                clearInterval(timer);
              }
              that.setData({
                time: str
              })
            }, 1000)
          this.data.list = res
          this.setData({
            list: this.data.list
          })
        })
        if (shareUser != undefined) {
          this.setData({
            shareUser: shareUser
          })
          util.request(api.share1, { id: id, thr_session: shareUser, thr_session1: user_id }, "POST").then(res => {
            console.log(res)
          }).catch(err => {
            console.log('err:' + err)
          })
        }
      } else {
        util.request(api.good, { id: id, thr_session: user_id }, "GET").then(res => {
          console.log(res)
          this.setData({
            list: res
          })
        })
        if (shareUser!=undefined) {
          this.setData({
            shareUser: shareUser
          })
          util.request(api.share, { thr_session: shareUser, id: id, thr_session1: user_id }, "POST").then(res => {
            console.log(res)
          }).catch(err => {
            console.log('err:' + err)
          })
        }
      }
    } else {
      util.showModal('请先去登录!', true, '确定').then(res => {
        if (res) {
          wx.switchTab({
            url: '/pages/user/user'
          })
        }
      }).catch(err => {
        if (err == false) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  nowTime() { //时间
    var that = this,
      intDiff = that.data.list.time,
      day = 0,
      hour = 0,
      minute = 0,
      second = 0,
      timer = setInterval(function () {

        if (intDiff > 0) { //转换时间
          day = Math.floor(intDiff / (60 * 60 * 24));
          hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
          minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
          if (hour <= 9) hour = '0' + hour;
          if (minute <= 9) minute = '0' + minute;
          if (second <= 9) second = '0' + second;
          intDiff--;
          var str = hour + ':' + minute + ':' + second
          // console.log(str)    
        } else {
          var str = "已结束！";
          clearInterval(timer);
        }
        that.setData({
          time: str
        })
      }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)

    var userName = app.globalData.userInfo.username,
      state = this.data.state,
      user_id = app.globalData.loginState,
      id = options.target.dataset.id;
    if (options.from == 'button') {
      if (state == 1) {
        return {
          title: userName + '推荐，数量有限，先到先得',
          desc: '',
          path: '/pages/productDetails/productDetails?state=' + state + '&user_id=' + user_id + '&id=' + this.data.id,
          success: function (res) {
            console.log(res)
          }
        }
      } else {
        return {
          title: userName + '推荐，数量有限，先到先得',
          desc: '',
          path: '/pages/productDetails/productDetails?user_id=' + user_id + '&id=' + id,
          success: function (res) {
            console.log(res)
          }
        }
      }
    }

  },
  //轮播图预览
  swiperImg(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index,
      current = this.data.list.pic[index],
      urls = this.data.list.pic
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },
  //图片预览
  previewImage(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index,
      index1 = e.currentTarget.dataset.index1,
      urls = this.data.list.com[index].img,
      current = this.data.list.evaluate[index].img[index1];
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },
  previewImage1(e) {
    console.log(e)
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img
    })
  },
  //分享
  share() {
    if (app.globalData.loginState) {
      this.setData({
        popup: true
      })
    } else {
      this.user()
    }
  },
  //生成海报
  poster(e) {
    console.log(e)
    let id = this.data.id,
      state = this.data.state;
    wx.navigateTo({
      url: '/pages/poster/poster?id=' + id + '&state=' + state,
    })
  },
  user() {
    util.showModal('请先去登录，再分享!', true, '确定').then(res => {
      if (res) {
        wx.switchTab({
          url: '/pages/user/user'
        })
      }
    }).catch(err => { })
  },
  popupHidden() {
    this.setData({
      popup: false
    })
  },
  popupShow() {
    this.setData({
      popup: true
    })
  },
  //立即开团或立即购买
  submit(e) {
    console.log(e)
    var state = this.data.state,
      user_id = e.currentTarget.dataset.shareuser,
      status=e.currentTarget.dataset.status,
      that = this;
    
    if (state == 1) {
      state = 1
      let goods = this.data.list.pintuan,
          arr = [];
      arr.push({ goods_id: goods.goods_id, goods_name: goods.goods_name, descr: goods.descr1, num: 1, price: goods.price,image:goods.pic })
      wx.setStorageSync('goods', arr)
      wx.setStorageSync('state', state)
      wx.setStorageSync('status', status)

    } else {
      state = ''
      let goods = this.data.list.goods,
          arr = [];
      arr.push({ goods_id: goods.id, goods_name: goods.name, descr: goods.descr1, num: 1, price: goods.price,image:goods.pic0 })
      wx.setStorageSync('goods', arr)
      wx.setStorageSync('state', state)
    }

    wx.navigateTo({
      url: '/pages/order/order?shareUser=' + that.data.shareUser
    })
  }
})