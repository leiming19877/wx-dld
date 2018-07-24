// pages/work-order-list/work-order-list.js
const app = getApp();
const rq = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worksheetStatus:[
      {
        'status':0,
        'desc':'草稿'
      },
      {
        'status':1,
        'desc':'未签名'
      },
      {
        'status':2,
        'desc':'已签名'
      },
      {
        'status':7,
        'desc':'已完成'
      }
    ],
    page:{
        pageNo:1,
        pageCount:0,
        totalCount:0,
        pageSize:5,
        hasNextPage:false,
        list:[
        /*{
          'id':0,
          'type':'吊钢材',
          'status':0,
          'createDate':'2017-10-09 10:12:13',
          'address':'长沙市岳麓区尖山路413号'
        },{
          'id':1,
          'type':'吊钢材2',
          'status':1,
          'createDate':'2018-10-09 10:12:13',
          'address':'长沙市岳麓区尖山路415号'
        }*/
        ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   /* wx.startPullDownRefresh({
      success:function(e){
       
          wx.showModal({
            title:'test',
            content:'test'
          });
          setTimeout(function(){
            wx.stopPullDownRefresh();
          },10000);
      }
    });*/
    this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*wx.startPullDownRefresh({
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
        console.log('work-list-开始下拉刷新', new Date());
       
        var self = this;
        wx.showLoading({
          title: '加载中...',
          mask:true
        })
         console.log('onPullDownRefresh', new Date());
        this.loadListData(false,function(page){
          self.refreshPage(page);
          wx.hideLoading();
          wx.stopPullDownRefresh();
          console.log('work-list-结束下拉刷新', new Date());
        });
        /*setTimeout(function(){
            wx.stopPullDownRefresh({
              complete: function (res) {
                wx.hideToast()
                self.loadListData(false,self.refreshPage);
               
              }
            })
        },1000);*/
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideLoading();
        console.log(res, new Date())
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    const page = this.data.page;
    if(!page.hasNextPage){
     /* wx.showToast({
        title:'没有更多数据了',
        icon:'info'
      });*/
      return ;
    }
    this.loadListData(true,this.refreshPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  openDetail:function(e){
    const dataset = e.target.dataset;
    const id = dataset.id;
    wx.navigateTo({
      'url':'../work-order-detail/work-order-detail?id='+id
    });
  },
  refreshPage:function(page){
      var worksheetStatus = this.data.worksheetStatus;
      var p = this.data.page;
      page.records.forEach(function(r){
          
          var desc = "";
          for(let i=0;i<worksheetStatus.length;i++){
              if(worksheetStatus[i].status == r.worksheetStatus){
                 desc = worksheetStatus[i].desc;
                 break;
              }
          }
          r.worksheetStatusDesc = desc;
      });
      p.hasNextPage = page.hasNextPage;
      p.pageNo = page.pageNum;
      p.pageSize = page.numPerPage;
      p.totalCount = page.totalCount;
      if(p.pageNo === 1){
        p.list = page.records;
      }else{
        p.list = p.list.concat(page.records);
      }
      this.setData({
        'page':p
      });

      //this.stopPullDownRefresh();
      //wx.hideLoading();
  },
  loadListData:function(more,cb){
    var self = this;
    var page = this.data.page;
    if(more){
      page.pageNo++;
    }else{
      page.pageNo = 1;
    }
    var params = {
      'pageNo':page.pageNo,
      'pageSize':page.pageSize
    };
    rq.request({
          url:app.apiUrl+'/worksheet/getList',
          data:params,
          login:true,
          success:function(rs){   
              var data = rs.data;
              if(data.resultCode === 0){
                var page = data.resultEntity;
                cb(page);
              }else{
                wx.showToast({
                  title:data.resultMessage
                });
              }
  
          },
          fail:function(error){
            if(error.type ==='ERR_WX_GET_USER_INFO'){
              wx.showToast({
                  title:'获取拒绝授权失败，请重试'
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
  }
})