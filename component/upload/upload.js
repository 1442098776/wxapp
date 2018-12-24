const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type:String,
      value: ''
    },
    url:{
      type:String,
      value:''
    },
    imgList:{
      type: Array,
      value: []
    }
  },
  data: {
    show:true,
    count:5,
  },
  methods: {
    updateImg() {
      var that = this;
      wx.chooseImage({
        count:that.data.count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          that.uploadImg({ url: that.data.url, path: tempFilePaths, name: 'file', user: app.globalData.loginState })          
        },
        fail: function (err) { }
      })
    },
    //取消图片
    cancel(e){
      console.log(e)
      let index=e.currentTarget.dataset.index;
      this.data.imgList.splice(index,1)
      this.setData({
        imgList:this.data.imgList,
        count:5-this.data.imgList.length
      })
      if (this.data.count!=5){
        this.setData({
          show:true
        })
      }
    },
    previewImage(e) {
      console.log(e)
      let index = e.currentTarget.dataset.index,
        urls = this.data.imgList,
        current = this.data.imgList[index];
      wx.previewImage({
        current: current,
        urls: urls,
      })
    },
    uploadImg(data) {
      var that = this,
        i = data.i ? data.i : 0,//当前上传的哪张图片
        success = data.success ? data.success : 0,//上传成功的个数
        fail = data.fail ? data.fail : 0;//上传失败的个数
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: data.name,//这里根据自己的实际情况改
        formData: data.user,//这里是上传图片时一起上传的数据
        success: (resp) => {
          console.log(resp)
          success++;//图片上传成功，图片上传成功的变量+1
          that.data.imgList.push(resp.data)
          that.setData({
            imgList: that.data.imgList
          })
          if (that.data.imgList.length == 5) {
            that.setData({
              show: false
            })
          }
          // that.triggerEvent('uploadImg', that.data.imgList)
          // console.log(that.data.imgList)
          // console.log(i);
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
        },
        fail: (res) => {
          fail++;//图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
          // console.log(i);
          i++;//这个图片执行完上传后，开始上传下一张            
          if (i == data.path.length) {   //当图片传完时，停止调用          
            // console.log('执行完毕');
            // console.log('成功：' + success + " 失败：" + fail);
          } else {//若图片还没有传完，则继续调用函数                
            // console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadImg(data);
          }
        }
      });
    },
  }
})
