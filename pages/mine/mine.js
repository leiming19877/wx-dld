// pages/mine/mine.js
const app = getApp();
var session = require("../../utils/session");
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  editUserName:function(){
      const user = this.data.user;
      if(!user || user.userType !== 1){
          return;
      }
      let userName = user.name?user.name:'';
      wx.navigateTo({
        'url':'../edit-name/edit-name?userName='+userName
      });
      return ;
  },
  editCompany:function(){
      const user = this.data.user;
      if(!user || user.userType !== 1){
          return;
      }
      let company = user.company?user.company:'';
      wx.navigateTo({
        'url':'../edit-company/edit-company?company='+company
      });
      return ;
  },
  getUserInfo:function(){
    var self = this;
    wx.showLoading({
      'title':'加载中'
    });
    rq.request({
          url:app.apiUrl+'/wechat/user/getSelfWechatUser',
          data:{
            '_t':new Date().getTime()
          },
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                var user = data.resultEntity;
                if(!user.avatarUrl ){
                   var userInfo = session.getUserInfo();
                   user.avatarUrl = userInfo.avatarUrl;
                }

                self.setData({
                  'user':user
                });
              }else{
               setTimeout(function(){
                  wx.showToast({
                    title:data.resultMessage
                  });
               },200);
              }
  
          },
          fail:function(error){
              setTimeout(function(){
                  wx.showToast({
                    title:'网络异常，请重新试试'
                  });
               },200);
             return ;
          },
          complete:function(){
            wx.hideLoading();
          }
        }); 
  },
  getUserInfo2:function(){
    var self = this;
    rq.request({
          url:app.apiUrl+'/wechat/user/getSelfWechatUser',
          data:{
              '_t':new Date().getTime()
          },
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                var user = data.resultEntity;
                if(!user.avatarUrl ){
                   var userInfo = session.getUserInfo();
                   user.avatarUrl = userInfo.avatarUrl;
                }

                self.setData({
                  'user':user
                });
              }else{
               setTimeout(function(){
                  wx.showToast({
                    title:data.resultMessage
                  });
               },200);
              }
  
          },
          fail:function(error){
              setTimeout(function(){
                  wx.showToast({
                    title:'网络异常，请重新试试'
                  });
               },200);
             return ;
          },
          complete:function(){
          
          }
        }); 
  }
})