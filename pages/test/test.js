const app = getApp();
const rq = require("../../utils/request");
Page({
  data: {
    toView: 'red',
    scrollTop: 100
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  getPhoneNumber:function(e){
   
    var detail = e.detail;
    if(detail.errMsg !== 'getPhoneNumber:ok'){
      wx.showToast({'title':'获取手机号失败，请重试'});
      return ;
    }
    var params = {
      'iv':detail.iv,
      'encryptedData':detail.encryptedData
    };
    var self = this;
    wx.showLoading({
      'title':'加载中'
    });
    rq.request({
          url:app.apiUrl+'/wechat/user/getWeChatPhoneNubmer',
          data:params,
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
     
                data = data.resultEntity;
                wx.showToast({
                    title:data.purePhoneNumber
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
  }
})