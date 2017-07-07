//index.js
//引入网络库
import {get, post} from "../../util/network.js"
Page({
    data: {
        result: '尝试发起请求',
    },
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
})
