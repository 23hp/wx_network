//index.js
//引入接口
import {getPhoto} from "../../util/service";

Page({
    data: {
        photo1: null,
        photo2: null,
    },
    //数据清零
    reset(){
        this.setData({
            photo1: null,
            photo2: null,
        })
    },
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
});
