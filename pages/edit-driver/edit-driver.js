// pages/edit-driver/edit-driver.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   isShowMask:false,//是否显示遮罩层
   isShowCarChoice:false,//是否显示选择车界面
   listCars: [],
   choiceCarIndex:[0],//选择的是那台车（数组下标）
   driverForm:{
    'driverId':null,//机手id
    'driverName':'',//机手姓名
    'driverMobile':'',//机手电话
    'deviceId':null,//车号id
    'deviceDesc':'请选择设备'//设备描述
    }
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListCars();
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
  getListCars:function(){
    var self = this;
    rq.request({
          url:app.apiUrl+'/device/getList',
          data:{},
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                var list = data.resultEntity;
                self.setData({
                  'listCars':list
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
              wx.showToast({
                     title:'网络异常，请重新试试'
              });
             return ;
          }
        });  
      return ;
  },
  setDeviceDes:function(){
    const driverForm = this.data.driverForm;
    const listCars = this.data.listCars;
    if(!driverForm.deviceId){
         driverForm.deviceDesc = '请选择设备';
         this.setData({
          'driverForm':driverForm
         });
         return ;
    }

    var index = -1;
    for(let i=0;i<listCars.length;i++){
     if(listCars[i].deviceId === driverForm.deviceId){
              index = i; 
              break;
          }
    }  
    if(index == -1){
       driverForm.deviceDesc = '司机的设备已删除，请选择设备';
         this.setData({
          'driverForm':driverForm
         });
         return ;
    }
    driverForm.deviceDesc =  listCars[index].deviceNo
    +'/'+listCars[index].deviceTypeName
    +'/'+listCars[index].deviceBrandName
    +'/'+listCars[index].deviceDesc+'(吨)';
    this.setData({
          'driverForm':driverForm
     });
   return ;
  },
  bindCarChange: function(e) {
    const val = e.detail.value;
    this.setData({
      'choiceCarIndex': [val[0]]
    });
  },
  bindChoiceCar:function(e){
    const  choiceCarIndex =this.data.choiceCarIndex;
    const listCars = this.data.listCars;
    const driverForm = this.data.driverForm;
    driverForm.deviceId = listCars[choiceCarIndex[0]].deviceId;
    this.setData({
      'driverForm':driverForm
    });
    this.setDeviceDes();
    this.hideCarChoice();
  },
  checkVal:function(){
    let form = this.data.driverForm;
    if(!form.driverName || "" === form.driverName.trim()){
      wx.showToast({
        title:'请输入机手姓名'
      });
      return false;
    }
    if(!form.driverMobile || "" === form.driverMobile.trim()){
      wx.showToast({
        title:'请输入机手电话'
      });
      return false;
    }
    if(!form.deviceId){
      wx.showToast({
        title:'请选择机手设备'
      });
      return false;
    }
    
    return true;
  },
  saveDriver:function(){
     var self = this;
     let flag = this.checkVal();
     if(!flag){
        return ;
     }
    
     let form = this.data.driverForm;
     
     let params = {
        driverId:form.driverId?form.driverId:'',//机手id
        driverName:form.driverName,//工作内容
        driverMobile:form.driverMobile,//客户联系电话
        deviceId:form.deviceId//客户名称
     };

    wx.showLoading({
      title: '保存中...',
    });
    rq.request({
          url:app.apiUrl+'/wechat/user/saveDriver',
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
                       page.loadListData();

                       const minePage =pages.pop();
                       minePage.getUserInfo2();
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
  },
  showMask:function(){
    this.setData({
        'isShowMask':true
    });
  },
  hideMask:function(){
    this.setData({
        'isShowMask':false
    });
  },
  showCarChoice:function(){
    this.showMask();
    this.setData({
        'isShowCarChoice':true
    });
  },
  hideCarChoice:function(){
    this.setData({
        'isShowCarChoice':false
    });
    this.hideMask();
  },
  bindDriverNameInput:function(e){
      var val = e.detail.value;
      const driverForm = this.data.driverForm;
      driverForm.driverName = val;
      this.setData({
        'driverForm':driverForm
      });
  },
  bindDriverMobileInput:function(e){
      var val = e.detail.value;
      const driverForm = this.data.driverForm;
      driverForm.driverMobile= val;
      this.setData({
        'driverForm':driverForm
      });
  }

})