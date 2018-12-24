const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    value: '',
    orderNumber: '',
    index: 0,
    text:'',
    imgList:[],
    url:'',   //上传图片接口路径
    expressNum:'',   //快递单号
    express:['顺丰速运','百世快递','中通快递','圆通速递','韵达速递', '邮政快递包裹','EMS','京东快递','优速快递','德邦快递', '宅急送','TNT快递','UPS', 'DHL', 'FEDEX联邦(国内件)', 'FEDEX联邦(国际件)'],
    expressCode: ['SF', 'HTKY', 'ZTO', 'YTO', 'YD', 'YZPY', 'EMS', 'JD', 'UC', 'DBL', 'ZJS', 'TNT', 'UPS', 'DHL', 'FEDEX','FEDEX_GJ'],
    list:{}
  },
  onLoad: function (options) {
    let orderNumber=options.orderNumber,
        text=options.text;
        this.setData({
          text:text,
          orderNumber: orderNumber,
          url: api.order_return_img
        })
    util.request(api.order_return, { orderid: orderNumber, thr_session:app.globalData.loginState},"POST").then(res=>{
      console.log(res)
      this.setData({
        list:res
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择要退货的商品
  choose(e){
    // console.log(e)
    let index=e.currentTarget.dataset.index,
        that=this;
        this.data.list.goods[index].aa=!this.data.list.goods[index].aa;
        this.setData({
          list:this.data.list
        })

  },
  checkValue(e) {
    let value = e.detail.value;
    this.setData({
      value: value
    })
  },
  //提交
  submit(e) {
    console.log(e)
      var orderNumber=this.data.orderNumber,
        value=this.data.value,
        that=this,
        status=this.data.list.status,
      thr_session=app.globalData.loginState,
      expressNum = this.data.expressNum,
      index=this.data.index,
      name = this.data.express[index],
      code = this.data.expressCode[index];
        if(status==0){
          var upload = this.selectComponent('#upload')
          var imgList = upload.data.imgList;
          let arr=[];
          this.data.list.goods.forEach((item,i)=>{
            if(item.aa){
              arr.push(item)
            }
          })
          if(this.data.value!=''){
            util.request(api.order_return1, { thr_session: thr_session, id: orderNumber, descr: value, img: imgList, goods: arr }, "POST").then(res => {
              console.log(res)
              this.setData({
                list: res
              })
            })
          }else{
            util.showModal('请填写退货原因！', false, '确定').then(res => { })
          }
        }
        if(status==2){
          if (expressNum!=''){
            util.request(api.order_mun, { thr_session: thr_session, id: orderNumber, name: name, kddh: expressNum, code:code},"POST").then(res=>{
              // console.log(res)
              this.setData({
                list:res
              })
            })
          }else{
            util.showModal('请填写快递单号或选择快递公司！', false, '确定').then(res => { })
          }
        }
  },
  // //取消申请
  // cancel(e) {
  //   // console.log(e)
  //   let orderNumber = e.currentTarget.dataset.ordernumber;
  //   util.request(api, { orderNumber: orderNumber, user_id: app.globalData.loginState }, "POST").then(res => { })
  // },
  //修改申请
  change() {
    util.request(api.order_return_edit, { thr_session: app.globalData.loginState, id: this.data.orderNumber},"POST").then(res=>{
      console.log(res)
      res.status=0
      this.setData({
        list:res,
        value:res.descr,
        imgList:res.img
      })
    })
  },
  //快递公司
  check(e) {
    console.log(e)
    let index = e.detail.value;
    this.setData({
      index: index
    })
  },
  //快递单号
  inpputValue(e) {
    console.log(e)
    let value = e.detail.value;
    this.setData({
      expressNum: value
    })
  }
})