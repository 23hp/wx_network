# 网络请求库-微信小程序

使用 Promise 封装的微信小程序网络请求库
![请求示例](https://github.com/23hp/wx_network/blob/master/pic_loading.jpg)

### 功能

- 默认打印请求日志，输出请求路径、参数和返回结果
- 支持多重连续请求
- 方便的错误处理
 
### 目录说明
- example 微信小程序的演示项目，
- util 封装的请求库。

### 使用方法
1. 复制core目录下的network.js文件到你的项目目录，如utils文件夹下
2. 在需要地方引入库文件


## 小程序网络请求最佳实践


    import {get, post} from "../../util/network.js"

    // 发送GET请求
    loadGet(){
        get("/posts/1").then(data => {
            this.setData({result: JSON.stringify(data)});
        })
    },
    // 发送POST请求
    loadPost(){
        post("/posts", {id: 2}).then(data => {
            this.setData({result: JSON.stringify(data)});
        })
    },
    // 处理失败与异常
    loadAndHandleException(){
        get("/posts/3").then(data => {
            throw '我出错了！'
        }).catch(e => {
            wx.showToast({title: '加载失败：' + e.toString(), image: '/image/warn.png'})
        })
    },
    // 显示加载框
    loadWithDialog(){
        wx.showLoading({title: '加载中'});
        get("/posts/4").then(data => {
            this.setData({result: JSON.stringify(data)});
            wx.hideLoading();
        }).catch(e => {
            wx.showToast({title: '加载失败' + e.toString(), image: '/image/warn.png'})
        })
    },
    //连续的请求
    multiRequest(){
        wx.showLoading({title: '加载中'});
        get("/posts/11")
            .then(data1 => {
                let result = JSON.stringify(data1);
                this.setData({result: result});
                return get("/posts/12");
            })
            .then(data2 => {
                let result = this.data.result + '\n' + JSON.stringify(data2);
                this.setData({result: result});
                return get("/posts/13");
            })
            .then(data3 => {
                let result = this.data.result + '\n' + JSON.stringify(data3);
                this.setData({result: result});
            })
            .then(() => {
                wx.hideLoading();
            })
            .catch(e => {
                wx.showToast({title: '加载失败' + e.toString(), image: '/image/warn.png'})
            })
    }

看看POST方法都有哪些入参：

    /**
     * 发送POST请求
     * @param relativeUrl 相对路径 必填
     * @param param 参数 可选
     * @param header 请求头参数 可选
     * @returns {Promise}
     */
    export function post(relativeUrl,param,header) {
        return request("POST", relativeUrl, param,header);
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
 
      post("/user/authorization", {code: res.code})
        .then(data => {
            this.globalData.userInfo = res.userInfo; 
        })
        .catch(e => {
            wx.showToast({title: '加载失败：' + e.toString(), image: '/image/warn.png'})
        });

