const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
  data: {
    height: '',
    width: '',
    active: false,
    id: '',
    addressList: {
      id: '',
      user: '', //联系人
      phone: '', //联系号码
      ads: ['广东省', '深圳市', '光明新区'],
      address: '', //地址
      status: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id != undefined) {
      this.setData({
        id: options.id,
        active: true
      })
      util.request(api.edit_index_addres, { id: options.id, thr_session: app.globalData.loginState }, "POST").then(res => {
        console.log(res)
        this.setData({
          addressList: res
        })
      })
    }
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //样式改变
  active() {
    this.setData({
      active: true
    })
  },
  //收货人
  inputName(e) {
    let value = e.detail.value
    this.data.addressList.user = value
    this.setData({
      addressList: this.data.addressList
    })
    if (this.data.addressList.user.length == 0) {
      this.Toast('收货人不能为空!', 1000, "none")
    }
  },
  //电话号码
  inputTel(e) {
    let str = /^1\d{10}$/;
    let phone = e.detail.value;
    if (str.test(phone)) {
      this.data.addressList.phone = e.detail.value
      this.setData({
        addressList: this.data.addressList
      })
    } else {
      let that = this;
      wx.showToast({
        title: '手机号不正确!',
        icon: 'none',
        duration: 1000,
        success: function () {
          that.data.addressList.phone = ''
          setTimeout(function () {
            that.setData({
              addressList: that.data.addressList
            })
          }, 1000)
        }
      })
    }
  },
  //省市区
  changeRegin(e) {
    // console.log(e)
    this.data.addressList.ads = e.detail.value
    this.setData({
      addressList: this.data.addressList
    })
  },
  //详细地址
  inputAddress(e) {
    let value = e.detail.value
    this.data.addressList.address = value
    this.setData({
      addressList: this.data.addressList
    })
    if (this.data.addressList.address.length == 0) {
      this.Toast('地址不能为空!', 1000, "none")
    }
  },
  //默认设置
  setAddress() {
    var status = this.data.addressList.status;
    if (status == 1) {
      this.data.addressList.status = 0
    } else {
      this.data.addressList.status = 1
    }
    this.setData({
      addressList: this.data.addressList
    })
  },
  //添加、保存
  submit(e) {
    var API,date,toast,
       that=this;
    let tel = e.detail.value.phone,
      addressList = this.data.addressList,
      id=addressList.id,
      user = addressList.user,
      phone = addressList.phone,
      address = addressList.address,
      province = addressList.ads[0],
      city = addressList.ads[1],
      huo=addressList.ads[2],
      status = addressList.status;
      let str = /^1\d{10}$/,
        date1 = { id: id, user: user, phone: phone, address: address, province: province, city: city, huo: huo, status: status, thr_session: app.globalData.loginState },
        date2 = { user: user, phone: phone, address: address, province: province, city: city, huo: huo, status: status, thr_session: app.globalData.loginState }
    if (this.data.addressList.user.length == 0 || str.test(phone) == false || this.data.addressList.ads.length == 0 || this.data.addressList.address.length == 0) {
      this.Toast('请检查内容,格式有误!', 1000, "none")
      return false;
    }
    if (this.data.addressList.user.length != 0 && str.test(phone) == true && this.data.addressList.ads.length != 0 && this.data.addressList.address.length != 0) {
      if(this.data.id!=''){
        API = api.edit_addres
        date=date1
        toast='保存成功'
      }else{
        API = api.add_addres
        date = date2
        toast='添加成功'
      }
      util.request(API, date, "POST").then(res => {
        console.log(res)
        if (res.error == 1) {
          that.Toast(toast,2000, "success")
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/address/address'
            })
          },2000)
        }
      })
    }
  },
  Toast(msg, time, icon) {
    wx.showToast({
      title: msg,
      duration: time,
      icon: icon,
      mask: true
    })
  }
})