// pages/work-order-detail/work-order-detail.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      listSettlementMode:[
      {
        'id':1,
        'name':'现付'
      },
       {
        'id':2,
        'name':'月结'
      },
       {
        'id':3,
        'name':'记账'
      }
     ],
      user:{},//服务单位信息
      detail:{}//详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWorkOrderDetail(options.id);
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
  callCustPhone:function(e){
    const dataset  = e.target.dataset;
    const phone = dataset.phone;
    if(!phone){
      return ;
    }
    wx.makePhoneCall({
      'phoneNumber':phone
    });
  },
  //跳转到签名页面
  toSignPages:function(){
      wx.navigateTo({
        url: '../signpages/signpages'
      })
  },
  getWorkOrderDetail:function(id){
      var self = this;
      var listSettlementMode = this.data.listSettlementMode;
      wx.showLoading({
        'title':'加载中...',
        'mask':true
      });
      var params ={
        'worksheetId':id
      }
      rq.request({
          url:app.apiUrl+'/worksheet/getWorksheetById',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                  data  = data.resultEntity;
                  var workOrderDetatil = data.worksheet;
                  for(let i=0;i<listSettlementMode.length;i++){
                      if(listSettlementMode[i].id === workOrderDetatil.balanceMethod){
                        workOrderDetatil.balanceMethodStr = listSettlementMode[i].name;
                        break; 
                      }
                  }
                  self.setData({
                    'detail':workOrderDetatil
                 });
              }else{
          /*      wx.showModal({
                  title:'提示',
                  content:data.resultMessage
                });*/
                setTimeout(function(){
                  wx.showToast({
                  title:data.resultMessage,
                  mask:true,
                  duration:3000
                  });
                },200);
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
  },
  getSignInfo:function(){
      var detail = this.data.detail;
      var params ={
        'worksheetId':detail.worksheetId,
        'customerName':detail.customerName,
        'customerMobile':detail.customerMobile
      };
      wx.showLoading({
        'title':'加载中...',
        'mask':true
      });
      rq.request({
          url:app.apiUrl+'/worksheet/clickSignatureByOwner',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                  data  = data.resultEntity;
                  var signerRedirectUri = data.signerRedirectUri;
                  wx.navigateTo({
                     url: '../signpages/signpages?signerRedirectUri='+signerRedirectUri
                  });
                
              }else{
                setTimeout(function(){
                  wx.showToast({
                  title:data.resultMessage,
                  mask:true,
                  duration:3000
                  });
                },200);
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
  },
  doFinishWorksheet:function(){
    var self = this;
    wx.showModal({
      title:'提示',
      content:'确认完工',
      success:function(res) {
        if (res.confirm) {
           self.finishWorksheet(); 
        } else if (res.cancel) {
         
        }
      }
    });
  
  },
  finishWorksheet:function(){
      var self = this;
      var listSettlementMode = this.data.listSettlementMode;
      var detail = this.data.detail;
      var params ={
        'worksheetId':detail.worksheetId
      };
      wx.showLoading({
        'title':'操作中...',
        'mask':true
      });
      rq.request({
          url:app.apiUrl+'/worksheet/finishWorksheetByDriver',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                  data  = data.resultEntity;
                  for(let i=0;i<listSettlementMode.length;i++){
                      if(listSettlementMode[i].id === data.balanceMethod){
                        data.balanceMethodStr = listSettlementMode[i].name;
                        break; 
                      }
                  }
                  self.setData({
                    'detail':data
                  });
                
              }else{
                setTimeout(function(){
                  wx.showToast({
                  title:data.resultMessage,
                  mask:true,
                  duration:3000
                  });
                },200);
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