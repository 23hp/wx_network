# 网络请求库-微信小程序

使用 Promise 封装的微信小程序网络请求库，更少代码，更方便定制

![请求示例](https://github.com/23hp/wx_network/blob/master/demo.png)

### 功能

- 减少你70%的代码量，不再一遍遍重复微信的样板代码
- 调用灵活，错误处理简单而方便
- 支持并发/并行执行多个请求
- 自动打印请求日志
- 支持对请求的发起和响应进一步定制，实现固定参数、自动提取返回值指定数据、自动处理响应错误如token过期自动跳转的功能。

### 与微信原生请求库对比

微信现有请求方法

    let that = this;
    wx.request({
        url: SERVER_ROOT + '/user/authorization',
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
                that.setData({
                    userInfo:data.data.userInfo
                });
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

使用此库后

    authorization(res.code).then(data=>{
         this.setData({
            userInfo:data.userInfo
        });
    }).catch(e=>{
         wx.showToast({
            title: "连接服务器失败"
        });
    })

`authorization`是经过封装的请求方法，一次封装可多处调用。可以看到，原本27行代码量，减少到了8行。下面我们来看如何使用，并定制自己的请求方法。

### 请求示例

#### 单个请求

    getPhoto(1).then(data => this.setData({photo1: data}));

#### 带加载框和错误提示
    
    wx.showLoading({title: '加载中'});
    getPhoto(2).then(data => {
        this.setData({photo1: data});
        wx.hideLoading();
        // throw '我出错了！'   //todo 你可以尝试抛出一个异常
    }).catch(e => {
        wx.showToast({title: '请求失败'});
    })
    
#### 多个请求(顺序请求)

    getPhoto(3).then(data => {
        this.setData({photo1: data});
        return getPhoto(4); //下一个请求
    }).then(data =>{
        this.setData({photo2: data})
    });

#### 多个请求(同时请求)

    Promise.all([getPhoto(5), getPhoto(6)]).then(listData => {
        this.setData({
            photo1: listData[0],
            photo2: listData[1],
        });
    });


### 目录说明
- example 微信小程序的演示项目，
- util 封装的请求库。

### 使用方法

跟着本教程一同练习，你马上就能上手。

1. 复制util目录下的`network.js`和`service.js`文件到你的项目目录，network.js 存放原始的请求方法，service存放接口。
2. 按需引入`service.js`中相应请求方法并调用。

### 定义接口

在service.js中定义请求方法

    import {get, post} from './network';

    const API_ROOT = 'https://jsonplaceholder.typicode.com'; //服务器根路径

    //请求图片
    export function getPhoto(id){
        const url = API_ROOT + '/photos/' + id;
        return get(url);
    }

### 引入和调用

    import {getPhoto} from '../../util/service';

    onLoad(){
     getPhoto(1).then(data =>{
        this.setData({photo1: data}));
     } 
    },


使用then方法就可以获取到返回值了，如果需要处理错误，再在后面接catch方法，详见上面第二个请求示例。

教程到这里就结束了，是不是很简单？

### 进一步封装示例

也许你还想要一些高级特性，比如说处理诸如固定参数、自动提取返回值指定数据、自动处理响应错误、登录凭证过期提示用户并自动跳转等功能。那你就会用到下面的进阶教程了。

#### 例1：固定参数

某些接口需要固定传参，比如说平台标识、用户凭证、特定的header等等。如果每次调用都要手动传入，不仅麻烦，而且也不利于修改。

以接口要传入指定header参数为例，有了`network.js`这层封装，现在我们可以这样做：

找到`network.js`下的这段代码：

    
    /**
    * 接口请求基类方法
    * @param method 请求方法 必填
    * @param url 请求路径 必填
    * @param data 请求参数
    * @param header 请求头
    * @returns {Promise}
    */
    export function request(method, url, data, header = {'Content-Type': 'application/json'}) {
        console.info(method, url);
        return new Promise((resolve, reject) => {
            const response = {};
            wx.request({
                url, method, data, header,
                success: (res) => response.success = res.data,
                fail: (error) => response.fail = error,
                complete: () => { ... },
            });
        });
    }

> 这里我们把微信的wx.request API封装成了自定义request方法，返回了一个Promise对象。我们的get、post、put、delete最终调用的都是这个方法。

我们要定义该方法的第四个参数header(请求头)，它有一个默认值`header = {'Content-Type': 'application/json'}`，当我们没有传入header时，它会自动使用默认值，我们可以直接改变这个值：

    export function request(method, url, data, header = 'Content-Type': 'application/json'}) {
         ...
     }

    =>

    export function request(method, url, data, header ={'Content-Type': 'application/x-www-form-urlencoded'}) {
         ...
     }

这样，所有接口将会使用新的默认header参数进行请求了。

#### 例2：自动解析数据
服务器返回的数据往往有某种固定格式，需要我们做一些变换才能使用。拿一个典型的返回值例子来说：

    {
        "code":1,
        "data":{
            "name":"凯"
        },
        "message":""
    }

我们拿到数据首先要**判断`code`值是否为`1`**，才能正常取出需要的`data`里面的字段，不为`1`则要做错误处理。假如每次都对返回值做判断，我们的代码会变得更加凌乱和难于维护。
还是在`network.js`方法里:

    export function request(method, url, data, header = {'Content-Type': 'application/json'}) {
        console.info(method, url);
        return new Promise((resolve, reject) => {
            const response = {};
            wx.request({
                url, method, data, header,
                success: (res) => {
                    if (res.data.code === 1) { //判断code值
                        response.success = res.data.data; // 你将在then方法中看到的数据
                    } else {
                        response.fail = res.data; // 你将在catch方法中接收到该错误
                    }
                },
                fail: (error) => response.fail = error,
                complete: () => { ... },
            });
        });
    }

通过改造，我们再次调用`service.js`中定义的方法将会直接得到正确的数据。

#### 例3：通用错误处理
服务器返回的错误往往有规律可循，以下面这段返回值为例：

    {
        "code":-2,
        "data": null,
        "message":"登录已过期"
    }

接前面的例子，当`code`值不为`1`时，`message`字段返回异常信息，不同的`code`值我们要做不同的处理，处理方法跟例2相近。

这里假设`code`为`-2`时，代表登录过期，需要跳转到登录页

    export function request(method, url, data, header = {'Content-Type': 'application/json'}) {
        console.info(method, url);
        return new Promise((resolve, reject) => {
            const response = {};
            wx.request({
                url, method, data, header,
                success: (res) => {
                    if (res.data.code === 1) { 
                        response.success = res.data.data; // 你将在then方法中看到的数据
                    } else if (res.data.code === -2) { 
                        wx.navigateTo({url:'/pages/login/login'}); // 跳去登录页
                    } else {
                        response.fail = res.data; // 你将在catch方法中接收到该错误
                    }
                },
                fail: (error) => response.fail = error,
                complete: () => { ... },
            });
        });
    }

这样，当任何一个返回的`code`值为`-2`时，小程序都会跳到登录页了。

- - -

教程到此结束，对你有所帮助的话，顺手给个 ♥ 吧！ 欢迎你提出建议，或和我一起完善代码！