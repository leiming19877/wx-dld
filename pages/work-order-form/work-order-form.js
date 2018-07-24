// pages/work-order-form/work-order-form.js
const app = getApp();
const rq = require("../../utils/request");
//const m =   require("../../utils/moment/moment");
const  dateUtil = require("../../utils/date-util");
const choicDeviceKey = "_choic_device_info";
Page({

  /**
   * 页面的初始数据
   */
  data: {
     isShowMask:false,//是否显示遮罩层
     isShowCarChoice:false,//是否显示选择车界面
     form:{
        workContent:'',//工作内容
        phone:'',//客户联系电话
        custName:'',//客户名称
        address:'',//工作地点
        money:'',//金额
        appointmentMinDate:dateUtil.formatDate(new Date()),
        appointmentMaxDate:dateUtil.formatDate(dateUtil.dateAdd(new Date(),'month',2)),
        appointmentDate:dateUtil.formatDate(new Date),//预约日期
        appointmentTime:dateUtil.formatHourTime(new Date()),//预约时间
        settlementModeId:-1,//结算方式
        deviceId:null,//车号id
        deviceDesc:'请选择设备'//设备描述
     },
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
     listCars: [/*{
      'id':0,
      'license':'湘A123456',
      'carTypeName':'起重机',
      'brandName':'三一重工',
      'weight':20
     },{
      'id':1,
      'license':'湘A45678',
      'carTypeName':'起重机2',
      'brandName':'三一重工',
      'weight':20
     },{
      'id':2,
      'license':'湘A09876',
      'carTypeName':'起重机3',
      'brandName':'三一重工',
      'weight':20
     }*/],
     choiceCarIndex:[0],//选择的是那台车（数组下标）
     listTypes:[{
      'id':1,
      "type":"起重机",
      "listItem":[
      ]      
     },{
      'id':2,
      "type":"混凝土",
      "listItem":[
        
      ]      
     }],
     listBrand:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getListCars();
    //this.getCarMetadata();
    //this.initAppointmentDate();
     //保存选择的设备信息
   let deviceInfoStr =  wx.getStorageSync(choicDeviceKey);
   if(deviceInfoStr){
    const form = this.data.form;
    const deviceInfo = JSON.parse(deviceInfoStr);
    form.deviceId = deviceInfo.deviceId;
    form.deviceDesc = deviceInfo.deviceDesc;
    this.setData({
      'form':form
     });
    }
   
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
 /* initAppointmentDate:function(){
    const form = this.data.form;
    var  t = m().format('YYYY-MM-DD');
    form.appointmentMinDate =m().format('YYYY-MM-DD');
    form.appointmentMaxDate =m().add(2,'M').format('YYYY-MM-DD');
    form.appointmentDate = m().format('YYYY-MM-DD');//预约日期
    this.setData({
      'form':form
    });
  },*/
  getListCars:function(cb){
    var self = this;
    wx.showLoading({
      title:'加载中...'
    });
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
                if(typeof cb === 'function'){
                    cb(list);
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
             return ;
          },
          complete:function(){
            wx.hideLoading();
          }
        });  
      return ;
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
                 },{
                  'id':2,
                  "type":"混凝土",
                  "listItem":listConcrete     
                 }];
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
  setDevice:function(deviceId){
    const form = this.data.form;
    const listCars = this.data.listCars;
    var index = -1;
    for(let i=0;i<listCars.length;i++){
     if(listCars[i].deviceId === deviceId){
              index = i; 
              break;
          }
    }  
    if(index == -1){
       form.deviceDesc = '司机的设备已删除，请选择设备';
         this.setData({
          'form':form
         });
         return ;
    }
    form.deviceId = deviceId;
    form.deviceDesc =  listCars[index].deviceNo
    +'/'+listCars[index].deviceTypeName
    +'/'+listCars[index].deviceBrandName
    +'/'+listCars[index].deviceDesc+'(吨)';
    this.setData({
          'form':form
     });
   return ;
  },
  bindWorkContent:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.workContent = val;
    this.setData({
      'form':form,
    });
  },
  bindPhone:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.phone = val;
    this.setData({
      'form':form,
    });
  },
  bindCustName:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.custName = val;
    this.setData({
      'form':form,
    });
  },
  bindAddress:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.address = val;
    this.setData({
      'form':form,
    });
  },
  bindMoney:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.money = val;
    this.setData({
      'form':form,
    });
  },
  bindSettlementMode:function(e){
    const dataset = e.target.dataset;
    const form = this.data.form;
    form.settlementModeId = dataset.settlementModeId;
    this.setData({
      'form':form,
    });
  },
  bindAppointmentDate:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.appointmentDate = val;
    this.setData({
      'form':form,
    });
  },
  bindAppointmentTime:function(e){
    const val = e.detail.value;
    const form = this.data.form;
    form.appointmentTime = val;
    this.setData({
      'form':form,
    });
  },
  bindCarChange: function(e) {
    const val = e.detail.value;
    this.setData({
      'choiceCarIndex': [val[0]]
    });
  },
  bindChoiceCar:function(e){
    const  choiceCarIndex =this.data.choiceCarIndex;
    const form = this.data.form;
    const listCars = this.data.listCars;
    const index = choiceCarIndex[0];
    const deviceId = listCars[index].deviceId;
    /*form.carIndex = ;
    this.setData({
      'form':form,
    });*/
    this.setDevice(deviceId);
    this.hideCarChoice();
  },
  resetForm:function(){
    let form = this.data.form;
    form.workContent='';//工作内容
    form.phone='';//客户联系电话
    form.custName='';//客户名称
    form.address='';//工作地点
    form.money='';//金额
    form.settlementModeId=-1;//结算方式
    form.appointmentDate=dateUtil.formatDate(new Date);//预约日期
    form.appointmentTime=dateUtil.formatHourTime(new Date())//预约时间

    this.setData({
      'form':form,
    });
  },
  checkVal:function(){
    let form = this.data.form;
    if(!form.workContent || "" === form.workContent.trim()){
      wx.showToast({
        title:'请输入工作内容'
      });
      return false;
    }
    if(!form.phone || "" === form.phone.trim()){
      wx.showToast({
        title:'请输入客户联系电话'
      });
      return false;
    }
    if(!form.custName || "" === form.custName.trim()){
      wx.showToast({
        title:'请输入客户名称'
      });
      return false;
    }
    if(!form.address || "" === form.address.trim()){
      wx.showToast({
        title:'请输入要去的工作地点'
      });
      return false;
    }
    if(!form.money ){
      wx.showToast({
        title:'请输入金额，金额最多允许两位小数'
      });
      return false;
    }
    if(!(/^[0-9]+(\.\d{0,2})?$/.test(form.money))){ 
        wx.showToast({
          title: '金额必须是数字，且小数不能超过两位'
        });
      return false;
     }
     if(form.settlementModeId === -1){
       wx.showToast({
        title:'请选择结算方式'
       });
      return false;
     }
    if(!form.deviceId){
       wx.showToast({
        title:'请选择车号'
       });
      return false;
     }
     if(!form.appointmentDate){
       wx.showToast({
          title:'请选择预约日期'
       });
      return false;
     }
     if(!form.appointmentTime){
       wx.showToast({
          title:'请选择预约时间'
       });
      return false;
     }
    return true;
  },
  saveWorkOrder:function(formId){
     var self = this;
     let flag = this.checkVal();
     if(!flag){
        return ;
     }
     let form = this.data.form;
     
     let params = {
        'formId':formId,
        workContent:form.workContent,//工作内容
        customerMobile:form.phone,//客户联系电话
        customerName:form.custName,//客户名称
        workPlace:form.address,//工作地点
        money:form.money,//金额
        balanceMethod:form.settlementModeId,//结算方式
        deviceId:form.deviceId,
        appointmentTime:form.appointmentDate+' '+form.appointmentTime 
     };

    let chioicDeviceInfo={
      'deviceId':form.deviceId,
      'deviceDesc':form.deviceDesc
    };
    //保存选择的设备信息
    wx.setStorageSync(choicDeviceKey,JSON.stringify(chioicDeviceInfo));

    wx.showLoading({
      title: '保存中...',
    });
    rq.request({
          url:app.apiUrl+'/worksheet/create',
          method:'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:params,
          login:true,
          success:function(rs){
              var data = rs.data;
              if(data.resultCode === 0){
                  self.resetForm();
                  wx.navigateTo({
                    url:'../work-order-detail/work-order-detail?id='+data.resultEntity.worksheetId,
                    success:function(e){
                       
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
    var self = this;
    this.getListCars(function(list){
        if(list.length >0){
           self.showMask();
           self.setData({
                  'isShowCarChoice':true
              });
        }else{
           wx.showModal({
              title:'提示',
              content:'你还没有添加设备，现在去添加',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    'url':'/pages/car-list/car-list'
                  });
                } else if (res.cancel) {
                  //console.log('用户点击取消')
                }
              }
            });

        }
    });
   
  },
  hideCarChoice:function(){
    this.setData({
        'isShowCarChoice':false
    });
    this.hideMask();
  },
  formSubmit: function(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var formId = e.detail.formId;
    this.saveWorkOrder(formId);
  }
  
  
  

})