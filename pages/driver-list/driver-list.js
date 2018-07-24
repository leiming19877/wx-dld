// pages/driver-list/driver-list.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX:0,
    delBtnWidth:90,
    listDrivers:[]//机手列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /*wx.startPullDownRefresh({
        success:function(e){
        }
      });*/
      this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* wx.startPullDownRefresh({
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
       /*setTimeout(function(){
           wx.stopPullDownRefresh({
              complete: function (res) {
                wx.hideToast()
                self.loadListData();
              
              }
          });
       },1000);*/
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
  loadListData:function(cb){
    var self = this;
    var params = {
     
    };
    rq.request({
          url:app.apiUrl+'/wechat/user/getBelongDrivers',
          data:params,
          login:true,
          success:function(rs){   
              var data = rs.data;
              if(data.resultCode === 0){
                var list = data.resultEntity;
                list.forEach(function(e){
                  if(e.device){
                    e.deviceInfo =  e.device.deviceNo
                    +'/'+e.device.deviceTypeName
                    +'/'+e.device.deviceBrandName
                    +'/'+e.device.deviceDesc+'(吨)';
                  }
                });
                self.setData({
                  'listDrivers':list
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
  addDriver:function(){
    wx.navigateTo({
      url:'../edit-driver/edit-driver'
    });
  },
  touchS:function(e){
   
    if(e.touches.length==1){
      this.setData({
        //设置触摸起始点水平方向位置
        startX:e.touches[0].clientX
      });

    }

  },
  touchM:function(e){
    if(e.touches.length==1){
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
        txtStyle = "transform: translateX(0)";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "transform: translateX(-"+disX+"px)";
        if(disX>=delBtnWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "transform: translateX(-"+delBtnWidth+"px)";
        }

      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var listDrivers = this.data.listDrivers;
      listDrivers[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'listDrivers':listDrivers
      });
    }
  },
  touchE:function(e){
    if(e.changedTouches.length==1){
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth/2 ? "transform: translateX(-"+delBtnWidth+"px)":"transform: translateX(0)";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var listDrivers = this.data.listDrivers;
      listDrivers[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'listDrivers':listDrivers
      });

    }

  },
  //点击删除按钮事件
  doRemoveDriver:function(e){

    var self = this;
    var dataset = e.currentTarget.dataset;
    //获取列表中要删除项的下标
    var index = dataset.index;
    var driverId = dataset.driverId;

    wx.showModal({
      title: '提示',
      content: '你确定删除这个司机,删除后司机和车辆将解除关系',
      success: function(res) {
        if (res.confirm) {
          self.removeDriver(index,driverId);
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  removeDriver:function(index,driverId){

    var listDrivers = this.data.listDrivers;
    var self = this;
    var params = {
      'driverId':driverId
    };

    wx.showLoading({
      title:"操作中...",
      mask:true
    });
    rq.request({
          url:app.apiUrl+'/wechat/user/removeDriver',
          data:params,
          login:true,
          success:function(rs){   
           
              var data = rs.data;
              if(data.resultCode === 0){
                   //移除列表中下标为index的项
                   listDrivers.splice(index,1);
                   //更新列表的状态
                   self.setData({
                    'listDrivers':listDrivers
                   });
                   const pages = getCurrentPages();
                   const page = pages.pop();
                   if (page == undefined || page == null){
                     return; 
                   }
                   page.loadListData();

                   const minePage =pages.pop();
                   minePage.getUserInfo2();         
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
          },
          complete:function(){     
            wx.hideLoading();
          }
        });  
      return ;
  }
})