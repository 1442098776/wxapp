const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    circleList: [],//圆点数组  
    awardList: [],//奖品数组  
    colorCircleFirst: '#FEDF2B',//圆点颜色1  
    colorCircleSecond: '#F57069',//圆点颜色2  
    colorAwardDefault: '#F5F0FC',//奖品默认颜色  
    colorAwardSelect: '#ffe400',//奖品选中颜色  
    indexSelect:0,//被选中的奖品index  
    isRunning: false,//是否正在抽奖  
    list:{}
  },

  onLoad: function () {
    var that=this;
    if(app.globalData.loginState!=''){
      util.request(api.lucky1, { thr_session:app.globalData.loginState},"POST").then(res=>{
        console.log(res)
        that.setData({
          list:res
        })
        //奖品item设置  
        var awardList = [];
        //间距,怎么顺眼怎么设置吧.  
        var topAward = 25;
        var leftAward = 5,
          j;
        for (j = 0; j < 8; j++) {
          if (j == 0) {
            topAward = 0;
            leftAward = 5;
          } else if (j < 3) {
            topAward = topAward;
            //166.6666是宽.15是间距.下同  
            leftAward = leftAward + 167 + 5;
          } else if (j < 5) {
            leftAward = leftAward;
            //150是高,15是间距,下同  
            topAward = topAward + 150 + 15;
          } else if (j < 7) {
            leftAward = leftAward - 167 - 5;
            topAward = topAward;
          } else if (j < 8) {
            leftAward = leftAward;
            topAward = topAward - 150 - 15;
          }
          var imageAward = res.lucky[j];
          awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward });
        }
        this.setData({
          awardList: awardList
        })
      })
      util.showNavigation(2000,'')
    }else{
      util.showModal('请先去登录',true,'确定').then(res=>{
        if(res){
          wx.switchTab({
            url: '/pages/user/user'
          })
        }
      }).catch(err=>{
        if(err==false){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }
    var _this = this;
    //圆点设置  
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 0;
        leftCircle = 0;
      } else if (i < 6) {
        topCircle = 0;
        leftCircle = leftCircle + 90;
      } else if (i == 6) {
        topCircle = 0;
        leftCircle = 540;
      } else if (i < 12) {
        topCircle = topCircle + 90;
        leftCircle = 540;
      } else if (i == 12) {
        topCircle = 540;
        leftCircle = 540;
      } else if (i < 18) {
        topCircle = 540;
        leftCircle = leftCircle - 90;
      } else if (i == 18) {
        topCircle = 540;
        leftCircle = 0;
      } else if (i < 24) {
        topCircle = topCircle - 90;
        leftCircle = 0;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })

    //圆点闪烁  
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FEDF2B') {
        _this.setData({
          colorCircleFirst: '#F57069',
          colorCircleSecond: '#FEDF2B',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FEDF2B',
          colorCircleSecond: '#F57069',
        })
      }
    }, 500)//设置圆点闪烁的效果      
  },

  //开始抽奖  
  startGame: function () {
    if(this.data.list.integrales<this.data.list.jifen){
      util.showModal('您的积分不足',false,'知道了').then(res=>{
        console.log()
      })
    }else{
      if (this.data.isRunning) return
      this.setData({
        isRunning: true,
      })
      var _this = this;
      let indexSelect = 0
      var i = 0;
      var num = 0;    //请求回来的中奖奖品的下标
      var lotteryCount = ''      //中奖提示
      util.request(api.lucky, { thr_session: app.globalData.loginState }, "GET").then(res => {
        console.log(res)
        var allIndex = _this.data.list.lucky.findIndex((item, i) => {
          if (item.order_id == res.id) {
            return true;
          }
        })
        num = allIndex
        lotteryCount = res.prize_title
      })
      var timer = setInterval(function () {
        indexSelect++;
        //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度  
        i += 30;
        indexSelect = indexSelect % 8;
        if (indexSelect >= _this.data.list.lucky.length) {
          let indexSelect = 0
        }
        _this.setData({
          indexSelect: indexSelect
        })
        if (i > 1000) {
          //去除循环  
          let indexSelect = num
          _this.setData({
            indexSelect: indexSelect
          })
          clearInterval(timer)
          //获奖提示  
          wx.showModal({
            content: lotteryCount,
            showCancel: false,//去掉取消按钮  
            success: function (res) {
              if (res.confirm) {
                _this.data.list.integrales = _this.data.list.integrales - _this.data.list.jifen
                _this.setData({
                  isRunning: false,
                  list: _this.data.list
                })
              }
            }
          })
        }
      }, 80)
    }
  },
  help(){
    wx.showModal({
      content: '通过每天签到获取积分',
      showCancel:false,
      confirmText:'知道了',
      success:function(){}
    })
  }
})