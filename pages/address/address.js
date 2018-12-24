const util=require('../../utils/util.js');
const api=require('../../config/api.js');
const app = getApp();

Page({
  data: {
    hidden:true,
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.loginState == '') {
      app.loginModal()
    }else{
      util.request(api.addres, { thr_session:app.globalData.loginState},"POST").then(res=>{
        if(res.error==0){
          console.log(res)
        }else{
          console.log(res)
          this.setData({
            addressList: res
          })
        }
      })
    }
  },
  //是否设为默认
  setAddress(e) {
    let index = e.currentTarget.dataset.index,
        id=e.currentTarget.dataset.id,
      i = 0;
      console.log(id)
    util.request(api.set_addres, { id: id, thr_session:app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      if(res.error==1){
        for (i = 0; i < this.data.addressList.length; i++) {
          if (i == index) {
            this.data.addressList[index].status = 1
          } else {
            this.data.addressList[i].status = 0
          }
        }
        this.setData({
          addressList: this.data.addressList
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  //删除
  remove(e) {
    var index = e.currentTarget.dataset.index,
        id=e.currentTarget.dataset.id,
      arr = this.data.addressList,
      that = this;
    wx.showModal({
      content: '您确定要删除所选的地址吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.del_addres, { id: id, thr_session: app.globalData.loginState},"POST").then(msg=>{
            console.log(msg)
            if(msg.error==1){
              arr.splice(index, 1)
              that.setData({
                addressList: that.data.addressList
              })
            }
          })
        }
      }
    })
  },
  //添加地址
  Address(){
    if (this.data.addressList.length==5){
      wx.showToast({
        title: '最多只能添加五个地址!',
        duration:2000,
        icon:'none',
        mask:true
      })
    }else{
      this.setData({
        hidden: false
      })
    }
  },
  //使用微地址api接口添加
  addAddress1(){
    let that=this;
    wx.chooseAddress({
      success:function(res){
        console.log(res)
        if(res.errMsg=="chooseAddress:ok"){
          console.log('使用微地址api接口添加')
          util.request(api.wx_edit_addres, { thr_session: app.globalData.loginState, user: res.userName, phone: res.telNumber, address: res.detailInfo, province: res.provinceName, city: res.cityName, huo: res.countyName, status:1 }, "POST").then(res => {
            if(res.error==1){
              wx.redirectTo({
                url:'/pages/address/address'
              })
            }
          })
        }
        that.Data()
      },
      fail:function(err){
        console.log(err)
        that.Data()
      }
    })
  },
  //手动添加地址
  addAddress2(e){
    wx.navigateTo({
      url: '/pages/addAddress/addAddress',
    })
    this.Data()
  },
  //取消
  cancel(){
    this.Data()
  },
  Data(){
    this.setData({
      hidden: true
    })
  }
})