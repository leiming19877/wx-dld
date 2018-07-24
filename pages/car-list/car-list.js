// pages/car-list/car-list.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listCars:[],//设备列表
    isShowAddCar:false,//是否显示添加车辆界面
    isShowCarTypeChoice:false,//是否显示设备类型界面
    isShowCarBrandChoice:false,//是否显示设备品牌选择界面
    carForm:{
       carTypeCode:0,//类型code
       carTypeName:'',//类型名称
       carBrandCode:0,//品牌code
       carBrandName:'',//品牌
       carWeight:'',//重量
       carLicenseArea:'湘',//车牌地区
       carLicense:''//车牌
     },
     
     listTypes:[{
      'id':1,
      "type":"起重机",
      "listItem":[
      ]      
     }/*,{
      'id':2,
      "type":"混凝土",
      "listItem":[
        
       
     }] */ ],
     listBrand:[],
     listLicenses:['湘','京','津','沪','渝','蒙','新','藏','宁'
                  ,'桂','黑','吉','辽','晋','冀','青','鲁','豫'
                  ,'苏','皖','闽','赣','鄂','粤','琼','甘','陕'
                  ,'黔','滇','川']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getCarMetadata();
    /* wx.startPullDownRefresh({
        success:function(e){
        }
      });*/
      this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* this.getCarMetadata();
     wx.startPullDownRefresh({
      success:function(e){
      }
    });*/
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
        wx.showLoading({
          title:'加载中...',
          mask:true
        }); 
        this.loadListData(function(){
           wx.hideLoading();
           wx.stopPullDownRefresh();
        });
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
  getCarMetadata:function(){
    var self = this;
    rq.request({
          url:app.apiUrl+'/device/getMetadata',
          data:{},
          login:true,
          success:function(rs){
           
              var data = rs.data;
              if(data.resultCode === 0){
                var metadata = data.resultEntity;
                var listBrand = [];
                metadata.brands.forEach(function(e){
                   e = JSON.parse(e);
                   listBrand.push(e);
                });
                var deviceTypes = metadata.deviceTypes;
                var listCrane = [];//起重机
                var listConcrete = [];//混凝土
                deviceTypes.forEach(function(e){
                  e = JSON.parse(e);
                  if(e.dclass === '起重机'){
                    listCrane.push(e);
                  }else if(e.dclass === '混凝土'){
                    listConcrete.push(e);
                  }
                });
                var listTypes = [{
                  'id':1,
                  "type":"起重机",
                  "listItem":listCrane      
                 }/*,{
                  'id':2,
                  "type":"混凝土",
                  "listItem":listConcrete     
                 }*/];
                self.setData({
                  'listTypes':listTypes,
                  'listBrand':listBrand
                });
              }else{
                wx.showToast({
                  title:data.resultMessage
                });
              }
  
          },
          fail:function(error){
              wx.showToast({
                  title:'网络异常，请重新试试'
              });
          }
        });  
      return ;
  },
  loadListData:function(cb){
    var self = this;
   
    var params = {
     
    };
    rq.request({
          url:app.apiUrl+'/device/getList',
          data:params,
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
          
          },
          complete:function(){
            if(typeof cb ==="function"){
               cb();
            }
          }
        });  
      return ;
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
  showAddCar:function(){
    this.setData({
        'isShowAddCar':true
    });
    this.showMask();
  },
  hideAddCar:function(){
    this.setData({
        'isShowAddCar':false
    });
    this.hideMask();
  },
  showCarTypeChoice:function(){
    this.setData({
        'isShowCarTypeChoice':true
    });
  },
  hideCarTypeChoice:function(){
    this.setData({
        'isShowCarTypeChoice':false
    });
  },
  showCarBrandChoice:function(){
    this.setData({
        'isShowCarBrandChoice':true
    });
  },
  hideCarBrandChoice:function(){
    this.setData({
        'isShowCarBrandChoice':false
    });
  },
  bindCarWeightInput:function(e){
    const val = e.detail.value;
    const  carForm = this.data.carForm;
    carForm.carWeight =val;
    this.setData({
      'carForm':carForm
    });
  },
  bindLicenseAreaChange:function(e){
     var listLicenses = this.data.listLicenses;
     var carForm = this.data.carForm; 
     var index  = e.detail.value;
     carForm.carLicenseArea = listLicenses[index];
    this.setData({
      'carForm': carForm
    })
  },
  bindCarLicenseInput:function(e){
    const val = e.detail.value;
    const  carForm = this.data.carForm;
    carForm.carLicense =val;
    this.setData({
      'carForm':carForm
    });
  },
  bindCarType:function(e){
    const dataset = e.target.dataset;
    const  carForm = this.data.carForm;
    carForm.carTypeCode =dataset.code;
    carForm.carTypeName =  dataset.name;
    this.setData({
      'carForm':carForm
    });
    this.showCarBrandChoice();
  },
  bindCarBrand:function(e){
    const dataset = e.target.dataset;
    const  carForm = this.data.carForm;
    carForm.carBrandCode =dataset.code;
    carForm.carBrandName =  dataset.name;
    this.setData({
      'carForm':carForm
    });

    this.hideCarTypeChoice();
    this.hideCarBrandChoice();
  },
  addCar:function(){
    var self = this;
    let  carForm = this.data.carForm;
    if(!carForm.carTypeCode){
      wx.showToast({
          title: '请选择设备',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
    }
    if(!carForm.carBrandCode){
      wx.showToast({
          title: '请选择设备品牌',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
    }
    if(!carForm.carWeight){
      wx.showToast({
          title: '请输入总起重重量',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
    }
    if(!(/^[0-9]+(\.\d{0,2})?$/.test(carForm.carWeight))){ 
           wx.showToast({
          title: '总起重重量,必须是数字，且小数不能超过两位',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
     }
    if(!carForm.carLicense){
      wx.showToast({
          title: '请输入车牌号',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
    }
    if(carForm.carLicense.length != 6){
      wx.showToast({
          title: '车牌号必须6位长度',
          icon: 'warn',
          mask:true,
          duration: 2000
        });
      return ;
    }
  /*  const listCars = this.data.listCars;
    listCars.push({
       'id':listCars.length,
      'license':'湘A'+carForm.carLicense,
      'carTypeName':carForm.carTypeName,
      'brandName':carForm.carBrandName,
      'weight':carForm.carWeight,
    });*/

   var params ={
      'deviceType':carForm.carTypeCode,
      'brandType':carForm.carBrandCode,
      'deviceDesc':carForm.carWeight,
      'deviceNo':carForm.carLicenseArea+carForm.carLicense
    }
    carForm = {
       carTypeCode:0,//类型id
       carTypeName:'',//类型名称
       carBrandCode:0,//品牌id
       carBrandName:'',//品牌
       carWeight:'',//重量
       carLicense:''//车牌
     };
  
    wx.showLoading({
      title: '保存中...',
    });
    rq.request({
          url:app.apiUrl+'/device/create',
          method:'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
             
              var data = rs.data;
              if(data.resultCode === 0){
                //var list = data.resultEntity;
                wx.startPullDownRefresh({
                    success:function(e){
                    }
                });
                self.setData({
                  'carForm':carForm
                });
                self.hideAddCar();
          
                const pages = getCurrentPages();
                pages.pop();
                const minePage = pages.pop();
                if (minePage == undefined || minePage == null){
                   return; 
                }
                if(typeof minePage.getUserInfo2 === 'function'){
                  minePage.getUserInfo2();
                }  
               
              }else{
                wx.showToast({
                  title:data.resultMessage
                });
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