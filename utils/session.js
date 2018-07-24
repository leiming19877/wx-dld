var constants = require('./constants');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var OPEN_ID_KEY ="_open_id_key";
var PHONE_KEY ="_phone_key";
var USER_INFO_KEY ="_user_info_key";
var Session = {
    get: function () {
        return wx.getStorageSync(SESSION_KEY) || null;
    },

    set: function (session) {
        wx.setStorageSync(SESSION_KEY, session);
    },
    setOpenId:function(openId){
    	 wx.setStorageSync(OPEN_ID_KEY, openId);
    },
    getOpenId:function(){
 			return wx.getStorageSync(OPEN_ID_KEY) || null;
    },
    setPhone:function(phone){
         wx.setStorageSync(PHONE_KEY, phone);
    },
    getPhone:function(){
        return wx.getStorageSync(PHONE_KEY) || null;
    },
    setUserInfo:function(userInfo){
		wx.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
    },
    getUserInfo:function(){
    	var userInfo = wx.getStorageSync(USER_INFO_KEY) ;
    	if(userInfo){
    		return JSON.parse(userInfo);
    	}
    	return null;
    },
    clearSessionKey:function(){
        wx.removeStorageSync(SESSION_KEY);
    },
    clear: function () {
        wx.removeStorageSync(SESSION_KEY);
        wx.removeStorageSync(OPEN_ID_KEY);
        wx.removeStorageSync(PHONE_KEY);
        wx.removeStorageSync(USER_INFO_KEY);
    },
};

module.exports = Session;