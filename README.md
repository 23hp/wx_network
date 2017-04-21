# 网络请求库-微信小程序
使用 Promise 封装的微信小程序网络请求库
### 功能
- 支持微信支持的所有请求方式，支持上传下载
- 加载时显示加载框，错误时显示错误提示框。默认显示。
- 支持打印请求日志，输出请求路径、参数和返回结果。默认不打印。
 
### 使用方法
先在需要地方引入库文件

    import {get,post,upload,download} from "../../utils/networkUtil.js"

GET请求：

    get("/comments",{postId:1})
        .then(data=>{
            this.setData({result:JSON.stringify(data)});// 可以用this了！
        })

POST请求：

    post("/posts").then(data=>{
            this.setData({result:JSON.stringify(data)});
        },fail=>{
            console.log(fail);//请求失败
        })

用then方法接受返回参数，第一个参数是成功回调，第二个是失败回调，两个回调都是可选的

请求方法的参数配置：

	/**
	 * 发送get 请求
	 * @param relativeUrl 相对路径
	 * @param param 参数，可选
	 * @param showLog 是否打印日志
	 * @param showLoading 是否显示加载框
	 * @param showError 是否显示错误框
	 * @returns {Promise}
	 */
	export function get(relativeUrl, param = {}, showLog = false, showLoading = true, showError = true) {
	    return request("GET", relativeUrl, param, showLog, showLoading, showError);
	}


### 与微信原生请求库对比

使用前 

    wx.request({
        url: that.config.domainName + '/user/authorization',
        method: "POST",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            code: res.code
        },
        success(data){
            console.log(data);
            if(data.status && data.status.succeed==1) {
                that.globalData.userInfo = res.userInfo;
            }else {
                wx.showToast({
                    title: "获取数据失败"
                });
            }
        },
        fail(){
            wx.showToast({
                title: "连接服务器失败"
            });
        }
    })

使用后
 
      post("/user/authorization", {code: res.code}, true)
        .then(data => {
            this.globalData.userInfo = res.userInfo; 
        });

