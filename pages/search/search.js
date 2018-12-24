const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    value:'',
    list:[]
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  search(e){
    // console.log(e)
    let value=e.detail.value
    this.setData({
      value:value
    })
    util.request(api.select, { keywords:value},"GET").then(res=>{
      // console.log(res)
      this.data.list=res.data
      if(this.data.value.length==0){
        this.data.list=[]
      }
      this.setData({
        list: this.data.list
      })
    })
  },
  //清空
  clear(){
    this.setData({
      value:'',
      list:[]
    })
  }
})