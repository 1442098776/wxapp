const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    windowWidth: '',
    scrollLeft: '',
    canvasIndex: 1,
    canvas: [
      { canvasId: 'myCanvas', id: 'canvas' },
      { canvasId: 'myCanvas1', id: 'canvas1' },
      { canvasId: 'myCanvas2', id: 'canvas2' }
    ],
    list:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (e) {
        // console.log(e)
        that.setData({
          windowWidth: e.windowWidth,
          scrollLeft: e.windowWidth * 0.45
        })
      }
    })
    console.log(options)
    let id=options.id,
        state=options.state,
      user_id = app.globalData.loginState;
    
    if(state==''){
      let url = '/pages/productDetails/productDetails?id=' + id + '&user_id=' + user_id;
      util.request(api.share2, { id: id, thr_session:user_id,url:url}, 'GET').then(res => {
        console.log(res)
        that.setData({
          list:res.goods
        })
        var cardInfo = res.goods[1],
          cardInfo1 = res.goods[0],
          cardInfo2 = res.goods[2];

        that.getAvaterInfo(cardInfo)
        that.getAvaterInfo1(cardInfo1)
        that.getAvaterInfo2(cardInfo2)
      }).catch(err=>{
        console.log('err:'+err)
      })
    }else{
      let url = '/pages/productDetails/productDetails?id=' + id + '&user_id=' + user_id+'&state='+state;
      util.request(api.share2, { id: id, thr_session: user_id, url: url }, 'GET').then(res => {
        console.log(res)
        this.data.list=res.goods
        this.setData({
          list: this.datalist
        })
        var cardInfo = res.goods[1],
          cardInfo1 = res.goods[0],
          cardInfo2 = res.goods[2];

        that.getAvaterInfo(cardInfo)
        that.getAvaterInfo1(cardInfo1)
        that.getAvaterInfo2(cardInfo2)
      }).catch(err => {
        console.log('err:' + err)
      })
    }
    
    
  },
  onShow(){},
  showLoadin() {
    wx.showLoading({
      title: '生成中.....',
      mask: true,
    })
  },
  //海报1
  getAvaterInfo(cardInfo) {
    var that = this;
    this.showLoadin()
    // util.getImgInfo(cardInfo.beijing).then(res => {
    //   console.log(res)
    //   let bgSrc = res.path;
    //   this.getGoods(bgSrc, cardInfo)
    // })
    wx.getImageInfo({
      src: cardInfo.beijing,
      success:function(res){
        console.log(res)
        wx.hideLoading();
        let bgSrc = res.path;
        that.getGoods(bgSrc, cardInfo)
      }
    })
  },
  getGoods(bgSrc, cardInfo) {
    this.showLoadin()
    util.getImgInfo(cardInfo.img).then(res => {
      // console.log(res)
      let goodsSrc = res.path
      this.getCode(bgSrc, cardInfo, goodsSrc)
    })
    // wx.getImageInfo({
    //   src: cardInfo.img,
    //   success: function (res) {
    //     wx.hideLoading();
    //     let goodsSrc = res.path
    //     this.getCode(bgSrc, cardInfo, goodsSrc)
    //   }
    // })
  },
  getCode(bgSrc, cardInfo, goodsSrc) {
    var that = this;
    this.showLoadin()
    util.getImgInfo(cardInfo.ewm).then(res => {
      // console.log(res)
      let codeSrc = res.path
      this.sharePosteCanvas(bgSrc, cardInfo, goodsSrc, codeSrc)
    })
    // wx.getImageInfo({
    //   src: cardInfo.ewm,
    //   success: function (res) {
    //     wx.hideLoading();
    //     let codeSrc = res.path
    //     that.sharePosteCanvas(bgSrc, cardInfo, goodsSrc, codeSrc)
    //   }
    // })
  },
  sharePosteCanvas(bgSrc, cardInfo, goodsSrc, codeSrc) {
    this.showLoadin()
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas1');
    wx.createSelectorQuery().select('#canvas1').boundingClientRect(function (rect) {
      console.log(rect)
      var width = rect.width,
        height = rect.height,
        left = rect.left,
        right = rect.right;
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, width, height);
      if (bgSrc) {
        ctx.drawImage(bgSrc, 0, 0, width, height);
      }
      if (goodsSrc) {
        ctx.drawImage(goodsSrc, 22, 45, width * 0.7, height * 0.38)
      }
      if (cardInfo.name) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(cardInfo.name, width / 2, height * 0.45 + 45);
      }
      if (cardInfo.price) {
        ctx.setFontSize(15);
        ctx.setFillStyle('#FE4543');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo.price, width * 0.38, height * 0.5 + 55);
      }
      if (cardInfo.yprice) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo.yprice, width * 0.64, height * 0.5 + 55);
        ctx.setStrokeStyle('#666666')
        ctx.strokeRect(width * 0.55, height * 0.44 + 71, 40, 0.1);
      }
      if ('年轻') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('left');
        ctx.fillText('年轻', 34, height * 0.75);
      }
      if ('我的选择') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('left');
        ctx.fillText('我的选择', 34, height * 0.75 + 20);
        ctx.setStrokeStyle('#666666')
        ctx.strokeRect(34, height * 0.75 + 30, 17, 0.5);
      }
      if ('Young , I choose') {
        ctx.setFontSize(9);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('left');
        ctx.fillText('Young , I choose', 34, height * 0.75 + 50);
      }
      if ('唯戈商城') {
        ctx.setFontSize(8);
        ctx.setFillStyle('#999999');
        ctx.setTextAlign('center');
        ctx.fillText('唯戈商城', width / 2, height * 0.97);
      }
      if (codeSrc) {
        ctx.drawImage(codeSrc, width * 0.65, height * 0.73, 60, 60);
      }
    }).exec()
    setTimeout(function () {
      ctx.draw(); //这里有个需要注意就是，这个方法是在绘制完成之后在调用，不然容易其它被覆盖。
      wx.hideLoading();
    }, 1000)
  },
  // 海报2
  getAvaterInfo1(cardInfo1) {
    var that = this;
    this.showLoadin()
    // util.getImgInfo(cardInfo1.beijing).then(res => {
    //   // console.log(res)
    //   let bgSrc = res.path;
    //   this.getGoods1(bgSrc, cardInfo1)
    // })
    wx.getImageInfo({
      src: cardInfo1.beijing,
      success: function (res) {
        wx.hideLoading();
        let bgSrc = res.path;
        that.getGoods1(bgSrc, cardInfo1)
      }
    })
  },
  getGoods1(bgSrc, cardInfo1) {
    this.showLoadin()
    util.getImgInfo(cardInfo1.img).then(res => {
      // console.log(res)
      let goodsSrc = res.path
      this.getCode1(bgSrc, cardInfo1, goodsSrc)
    })
  },
  getCode1(bgSrc, cardInfo1, goodsSrc) {
    this.showLoadin()
    util.getImgInfo(cardInfo1.ewm).then(res => {
      // console.log(res)
      let codeSrc = res.path
      this.sharePosteCanvas1(bgSrc, cardInfo1, goodsSrc, codeSrc)
    })
  },
  sharePosteCanvas1(bgSrc, cardInfo1, goodsSrc, codeSrc) {
    this.showLoadin()
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    wx.createSelectorQuery().select('#canvas').boundingClientRect(function (rect) {
      console.log(rect)
      var width = rect.width,
        height = rect.height,
        left = rect.left,
        right = rect.right;
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, width, height);
      if (bgSrc) {
        ctx.drawImage(bgSrc, 0, 0, width, height);
      }
      if (goodsSrc) {
        ctx.drawImage(goodsSrc, 22, 45, width * 0.8, height * 0.38)
      }
      if (cardInfo1.name) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(cardInfo1.name, width / 2, height * 0.42+35);
      }
      if (cardInfo1.price) {
        ctx.setFontSize(15);
        ctx.setFillStyle('#FE4543');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo1.price, width * 0.38, height * 0.45 + 40);
      }
      if (cardInfo1.yprice) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo1.yprice, width * 0.62, height * 0.45 + 40);
        ctx.setStrokeStyle('#666666')
        ctx.strokeRect(width * 0.55, height * 0.44 + 40, 40, 0.2);
      }
      if ('年轻') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('年轻', width * 0.5, height * 0.7);
      }
      if ('我的选择') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('我的选择', width * 0.5, height * 0.7 + 20);
        ctx.setStrokeStyle('#fff')
        ctx.strokeRect(width * 0.5, height * 0.7 + 30, 17, 0.5);
      }
      if ('Young , I choose') {
        ctx.setFontSize(9);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('Young , I choose', width*0.5, height * 0.7 + 50);
      }
      if ('唯戈商城') {
        ctx.setFontSize(8);
        ctx.setFillStyle('#999999');
        ctx.setTextAlign('center');
        ctx.fillText('唯戈商城', width*0.6, height * 0.97);
      }
      if (codeSrc) {
        ctx.drawImage(codeSrc, width * 0.1, height * 0.67, 60, 60);
      }
    }).exec()
    setTimeout(function () {
      ctx.draw(); //这里有个需要注意就是，这个方法是在绘制完成之后在调用，不然容易其它被覆盖。
      wx.hideLoading();
    }, 1000)
  },

  //海报3
  getAvaterInfo2(cardInfo2) {
    var that=this;
    this.showLoadin()
    // util.getImgInfo(cardInfo2.beijing).then(res => {
    //   // console.log(res)
    //   let bgSrc = res.path;
    //   this.getGoods2(bgSrc, cardInfo2)
    // })
    wx.getImageInfo({
      src: cardInfo2.beijing,
      success: function (res) {
        wx.hideLoading();
        let bgSrc = res.path;
        that.getGoods2(bgSrc, cardInfo2)
      }
    })
  },
  getGoods2(bgSrc, cardInfo2) {
    this.showLoadin()
    util.getImgInfo(cardInfo2.img).then(res => {
      // console.log(res)
      let goodsSrc = res.path
      this.getCode2(bgSrc, cardInfo2, goodsSrc)
    })
  },
  getCode2(bgSrc, cardInfo2, goodsSrc) {
    this.showLoadin()
    util.getImgInfo(cardInfo2.ewm).then(res => {
      // console.log(res)
      let codeSrc = res.path
      this.sharePosteCanvas2(bgSrc, cardInfo2, goodsSrc, codeSrc)
    })
  },
  sharePosteCanvas2(bgSrc, cardInfo2, goodsSrc, codeSrc) {
    this.showLoadin()
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas2');
    wx.createSelectorQuery().select('#canvas2').boundingClientRect(function (rect) {
      console.log(rect)
      var width = rect.width,
        height = rect.height,
        left = rect.left,
        right = rect.right;
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, width, height);
      if (bgSrc) {
        ctx.drawImage(bgSrc, 0, 0, width, height);
      }
      if (goodsSrc) {
        // ctx.setFillStyle('#fff');
        // ctx.rect(width * 0.1 + 5, height * 0.11 + 5, width * 0.74, height * 0.49);
        // ctx.fill()
        ctx.drawImage(goodsSrc, 22, 45, width * 0.8, height * 0.38)
        // ctx.setStrokeStyle('#fff')
        // ctx.strokeRect(width * 0.1, height * 0.11 , width * 0.8, height*0.52);
      }
      if (cardInfo2.name) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#333333');
        ctx.setTextAlign('center');
        ctx.fillText(cardInfo2.name, width / 2, height * 0.42 + 45);
      }
      if (cardInfo2.price) {
        ctx.setFontSize(15);
        ctx.setFillStyle('#FE4543');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo2.price, width * 0.38, height * 0.45 + 55);
      }
      if (cardInfo2.yprice) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666666');
        ctx.setTextAlign('center');
        ctx.fillText('￥' + cardInfo2.yprice, width * 0.62, height * 0.45 + 55);
        ctx.setStrokeStyle('#666666')
        ctx.strokeRect(width * 0.55, height * 0.44 + 55, 40, 0.1);
      }
      if ('年轻') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('年轻', width * 0.54, height * 0.78);
      }
      if ('我的选择') {
        ctx.setFontSize(12);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('我的选择', width * 0.54, height * 0.78 + 20);
        ctx.setStrokeStyle('#fff')
        ctx.strokeRect(width * 0.54, height * 0.78 + 30, 17, 0.5);
      }
      if ('Young , I choose') {
        ctx.setFontSize(9);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.fillText('Young , I choose', width * 0.54, height * 0.78 + 50);
      }
      if ('唯戈商城') {
        ctx.setFontSize(8);
        ctx.setFillStyle('#999999');
        ctx.setTextAlign('center');
        ctx.fillText('唯戈商城', width /2, height * 0.97);
      }
      if (codeSrc) {
        ctx.drawImage(codeSrc, width * 0.1, height * 0.67, 60, 60);
      }
    }).exec()
    setTimeout(function () {
      ctx.draw(); //这里有个需要注意就是，这个方法是在绘制完成之后在调用，不然容易其它被覆盖。
      wx.hideLoading();
    }, 1000)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //滑动
  scroll(e) {
    let scrollLeft = e.detail.scrollLeft;
    if (scrollLeft >= 0 && scrollLeft < this.data.windowWidth * 0.3) {
      this.setData({
        canvasIndex: 0
      })
    } else if (scrollLeft >= this.data.windowWidth * 0.45 && scrollLeft <= this.data.windowWidth * 0.8) {
      this.setData({
        canvasIndex: 1
      })
    } else if (scrollLeft > this.data.windowWidth * 0.8 && scrollLeft <= this.data.windowWidth) {
      this.setData({
        canvasIndex: 2
      })
    }
  },
  //保存
  submit() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: that.data.canvas[that.data.canvasIndex].canvasId,
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res1) {
              console.log(res1)
              wx.showToast({
                title: '赶紧晒一下吧~',
                duration: 2000
              })
            },
            fail: function (err1) { }
          })
        },
        fail: function (err) { }
      })
    }, 1000)
  }
})