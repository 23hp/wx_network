# 网络请求库-微信小程序

使用 Promise 封装的微信小程序网络请求库

![请求示例](https://github.com/23hp/wx_network/blob/master/demo.png)

### 功能

- 默认打印请求日志，输出请求路径、参数和返回结果
- 支持多重连续请求
- 方便的错误处理
 
### 目录说明
- example 微信小程序的演示项目，
- util 封装的请求库。

### 使用方法
1. 复制util目录下的`network.js`和`service.js`文件到你的项目目录，network.js 存放原始的请求方法，service存放接口。
2. 在需要地方引入

## 小程序网络请求最佳实践

### 在service.js中定义一个请求方法

    import {get, post} from "../../util/network.js"
    //请求一张图片
    export const getPhoto = (id) => get(`${API_ROOT}/photos/${id}`);

### 调用请求方法

    import {getPhoto} from "../../util/service";

    onLoad(){
     getPhoto(1).then(data => this.setData({photo1: data}));
    }

### 各种请求实例

    // 单个请求
    loadOne() {
        this.reset(); //数据清零
        getPhoto(1).then(data => this.setData({photo1: data}));
    },
    // 带加载框和错误提示
    loadWithDialog() {
        this.reset();
        wx.showLoading({title: '加载中'});
        getPhoto(2).then(data => {
            this.setData({photo1: data});
            wx.hideLoading();
            // throw '我出错了！'   //todo 你可以尝试抛出一个异常
        }).catch(e => {
            wx.showToast({title: '请求失败', image: '/image/warn.png'});
            console.error('请求失败',e);
        })
    },
    // 多个请求(顺序请求)
    loadOneByOne() {
        this.reset();
        getPhoto(3)
            .then(data => {
                    this.setData({photo1: data});
                    return getPhoto(4);
                }
            ).then(data =>
            this.setData({photo2: data})
        );

    },
    // 多个请求(同时请求)
    loadMany() {
        this.reset();
        Promise.all([getPhoto(5), getPhoto(6)]).then(listData => {
            this.setData({
                photo1: listData[0],
                photo2: listData[1],
            });
        });
    },


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
            wx.showToast({title: '加载失败：' + JSON.stringify(e), image: '/image/warn.png'})
        });

