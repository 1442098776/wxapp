var api=require('../config/api.js');


const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/**
 * 封装微信的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        // console.log(res);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function(err) {
        reject(err);
        console.log("failed");
      }
    });
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function(e) {
        // console.log(e);
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          // console.log(res);
          wx.setStorageSync("code", res.code);
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function(resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        // console.log(res);
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: "/pages/user"
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}
function showNavigation(time,msg){
  wx.showNavigationBarLoading()
  setTimeout(function () { wx.hideNavigationBarLoading() }, time);
  wx.showLoading({
    title: msg,
    mask: true,
    duration: time
  })
}
function showModal(content, showCancel, confirmText){
  return new Promise(function(resolve,reject){
    wx.showModal({
      content: content,
      showCancel: showCancel,
      confirmText: confirmText,
      success:function(e){
        if (e.confirm){
          resolve(true)
        }else{
          reject(false)
        }
      },
      fail:function(err){
        reject(err)
      }
    })
  })
}
function getImgInfo(src){
  return new Promise(function(resolve,reject){
    wx.getImageInfo({
      src: src,
      success: function(res){
        wx.hideLoading();
        resolve(res)
      },
      fail:function(err){
        reject(err)
      }
    })
  })
}

module.exports = {
  formatTime,
  request,
  redirect,
  checkSession,
  login,
  getUserInfo,
  showNavigation,
  showModal,
  getImgInfo
};
