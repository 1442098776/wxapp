const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    orderNumber: '',
    text: '',
    url:'',    //上传图片接口路径
    product: [],
  },
  onLoad: function (options) {
    let orderNumber = options.orderNumber,
      text = options.text;
    this.setData({
      orderNumber: orderNumber,
      text: text,
      url: api.comment2
    })
    util.request(api.comment, { thr_session:app.globalData.loginState, id: orderNumber},"GET").then(res=>{
      console.log(res)
      res.goods.forEach((item,i)=>{
        item.value=''
        item.imgList=[]
        item.user = app.globalData.userInfo.username
      })
      this.setData({
        product:res.goods
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //评价文字
  checkValue(e){
    // console.log(e)
    let value=e.detail.value,
        index=e.currentTarget.dataset.index;
    this.data.product[index].value = value
    this.setData({
      product: this.data.product
    })
  },
  //提交
  submit(){
    this.data.product.forEach((item,i)=>{
      var upload = this.selectComponent('#upload' + i)
      var imgList = upload.data.imgList;
      this.data.product[i].imgList = imgList
      this.setData({
        product: this.data.product
      })
    })
    console.log(this.data.product)
    util.request(api.comment1, { thr_session: app.globalData.loginState, id: this.data.orderNumber,goods:this.data.product}, "POST").then(res => {
        console.log(res)
        if(res.error==1){
          wx.navigateTo({
            url: '/pages/orderManagement/orderManagement?state=7&sortIndex=0'
          })
        }
      })
  }
})