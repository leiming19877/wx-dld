var TOKEN_KEY="_token";
var Token = {

    get: function () {
    	let tokenStr = wx.getStorageSync(TOKEN_KEY);
        return  tokenStr? JSON.parse(tokenStr) : null;
    },

    set: function (token) {
        wx.setStorageSync(TOKEN_KEY, JSON.stringify(token));
    },

    clear: function () {
        wx.removeStorageSync(TOKEN_KEY);
    },
    getToken: function () {
		const t = this.get();
        if(t){
        	return t.token
        }
        return null;
    },
    getRefreshToken:function(){
        const t = this.get();
        if(t){
            return t.refreshToken
        }
        return null;
    },
    isExpire:function(){
    	var t = this.get();
    	var currentTime = Date.now();
        if(!t){
            return true;
        }
        var tokenGenTime = t.tokenGenTime;
        var expiresIn = t.expiresIn;
       //设置60秒误差
       return currentTime-tokenGenTime>(expiresIn-60)*1000;
    }
};
module.exports = Token;