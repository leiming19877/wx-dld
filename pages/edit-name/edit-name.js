// pages/edit-name/edit-name.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      form:{
        userName:''
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const form = this.data.form;
     var userName = options.userName;
     form.userName = userName;
     this.setData({
      'form':form
     });
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
  bindUserNameInput:function(e){
      var val = e.detail.value;
      const form = this.data.form;
      form.userName = val;
      this.setData({
        'form':form
      });
  },
  checkVal:function(){
    let form = this.data.form;
    if(!form.userName || "" === form.userName.trim()){
      wx.showToast({
        title:'请输入姓名'
      });
      return false;
    }
    return true;
  },
  saveUser:function(){
     var self = this;
     let flag = this.checkVal();
     if(!flag){
        return ;
     }
    
     let form = this.data.form;
     
     let params = {
        name:form.userName//名字
     };

    wx.showLoading({
      title: '保存中...',
    });
    rq.request({
          url:app.apiUrl+'/wechat/user/updateUserRealname',
          method:'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
             
              var data = rs.data;
              if(data.resultCode === 0){
                  wx.navigateBack({
                    success:function(){
                     
                       const pages = getCurrentPages();
                       const page = pages.pop();
                       if (page == undefined || page == null){
                         return; 
                       }
                       page.onLoad();
                    }
                  });
              }else{
               setTimeout(function(){
                 wx.showToast({
                  title:data.resultMessage
                });
               },300);
              }
           
          },
          fail:function(error){
               wx.showToast({
                  title:'网络异常，请重新试试'
              });
          },
          complete:function(){
               wx.hideLoading();
          }
        });  
  }
})