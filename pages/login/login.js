// pages/login/login.js
const app = getApp();
var session = require("../../utils/session");
var rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//手机号
    vCode:'',//验证码
    isAgreeTerms:false,//是否同意条款
    vCodeText:'获取验证码',
    isEnableVCodeBtn:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  /*  wx.request({
      url: 'http://127.0.0.1:8080/html5/access-control/cross-ajax.jsp',
      method:'GET',
      success:function(rs){
        
      },
      fail:function(s){
        
      },
      complete:function(rs){
        
      }
    })*/
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
  bindPhoneInput:function(e){
     const phone = e.detail.value;
    this.setData({
        'phone':phone
      });
  },
  bindVCodeInput:function(e){
    const vCode = e.detail.value;
    this.setData({
        'vCode':vCode
      });
  },
  checkboxChange:function(e){
    this.setData({
      'isAgreeTerms':!this.data.isAgreeTerms
    });
  },
  bindAgreeChange: function (e) {
        this.setData({
            isAgreeTerms: !!e.detail.value.length
        });
  },
  getVCode:function(){
      
      var self = this;
     /* if(!this.data.isAgreeTerms){
        wx.showToast({title:'请阅读相关条款'});
        return ;
      }*/
      const phone = this.data.phone;
      if(!phone){
        wx.showToast({title:'请输入手机号'});
        return false;
      }
      if(!/^1\d{10}$/.test(phone)){
        wx.showToast({title:'请输入合法的手机号'});
        return false;
      }
      this.setGetVCodeBtn();
      var data = {
      'mobile':phone
      };
      rq.request({
          url:app.apiUrl+'/wechat/getValidateCode',
          //method:'POST',
          data:data,
          login:false,
          success:function(rs){ 
              var data = rs.data;
              if(data.resultCode === 0){
                   wx.showToast({
                      title:'验证码已发'
                   });       
              }else{
                wx.showToast({
                  title:data.resultMessage
                });
              }
  
          },
          fail:function(error){
            
            if(error.type ==='ERR_WX_GET_USER_INFO'){
              wx.showToast({
                  title:'获取拒绝授权失败，短信发送失败，请重试'
              });
            }else if(error.type ==='ERR_LOGIN_MISSING_SESSION'){
                 wx.showToast({
                  title:'获取微信会话失败，请重试'
              });
            }else{
               wx.showToast({
                  title:'网络异常，请重新试试'
              });
            }
             return ;
          }
        });  
      return ;
     
  },
  setGetVCodeBtn:function(){
          let self = this;
          let num = 120;
          this.setData({
            'isEnableVCodeBtn':false
          });
          var ti =  setInterval(function(){
             if(num == 0){
               clearInterval(ti);
                self.setData({
                  'isEnableVCodeBtn':true,
                  'vCodeText':'重新获取'
                });
               return ;
             }
             self.setData({
              'vCodeText':num+'秒后重新获取'
            });
            num--;
         },1000);
       return ;
  },
  checkVal:function(){
    const phone = this.data.phone;
    const vCode = this.data.vCode;
   
    if(!phone){
      wx.showToast({title:'请输入手机号'});
      return false;
    }
    if(!/^1\d{10}$/.test(phone)){
      wx.showToast({title:'请输入合法的手机号'});
      return false;
    }
    if(!vCode){
      wx.showToast({title:'请输入验证码'});
      return false;
    }
    if(!/^\d{4}$/.test(vCode)){
      wx.showToast({title:'验证码长度必须为4'});
      return false;
    }
   
    return true;
  },
  bindLogin:function(e){
      const self = this;
      const flag = this.checkVal();
      if(!flag){
        return ;
      }
      
      const phone = this.data.phone;
      const vCode = this.data.vCode;
      //const openId = session.getOpenId();
      const data = {
        'mobile':phone,
        'identifyingCode':vCode
      };
      wx.showLoading({
        title:'请稍等...'
      });
      rq.request({
        url:app.apiUrl+'/wechat/register',
        //method:'POST',
        data:data,
        login:true,
        success:function(rs){
          
          var data = rs.data;
          if(data.resultCode === 0){
            session.setPhone(phone);
            wx.switchTab({
              'url':'../work-order-list/work-order-list'
            });
          }else{
             wx.showToast({
                  title:data.resultMessage
                });
          }
        },
        fail:function(error){  
            
            if(error.type ==='ERR_WX_GET_USER_INFO'){
               wx.showModal({
                'title':'提示',
                'content':'你拒绝了获取微信用户授权，是否重新开启',
                 success:function(res){
                    if(res.confirm){
                       self.authUserInfoSetting();
                    }else if(res.cancel){
                      wx.showToast({title:'你拒绝了获取微信用户授权，将无法登录，需登录可重新开启制授权。'});
                    }
                 }
               });
              return ;
            }
            var msg = error.message;
            if(error.detail && error.detail.errMsg){
                 msg+=error.detail.errMsg;
            }    
           /* if(error.type ==='ERR_WX_GET_USER_INFO'){
              wx.showToast({
                  title:'获取拒绝授权失败，短信发送失败，请重试'
              });
            }else if(error.type ==='ERR_LOGIN_MISSING_SESSION'){
                 wx.showToast({
                  title:'获取微信会话失败，请重试'
              });
            }else if(error.type ==='ERR_WX_LOGIN_FAILED'){

               wx.showToast({
                  title:msg
              });
            }else{
               wx.showToast({
                  title:'网络异常，请重新试试'
              });
            }*/
            setTimeout(function(){
                    wx.showToast({
                              title:msg
                       });
            },200);
        return ;
        },
        complete:function(){
          wx.hideLoading();
        }
      });
  },
  authUserInfoSetting:function(){
    wx.openSetting({
                success: (res) => {
                        
                        /*
                         * res.authSetting = {
                         *   "scope.userInfo": true,
                         *   "scope.userLocation": true
                         * }
                         */
                        if(res.authSetting['scope.userInfo']){
                           wx.showToast({
                            'title':'授权成功'
                           });
                        }else{
                          wx.showToast({
                            'title':'授权失败,将无法登录'
                           });
                        }
                      }
              });
  }
})