//index.js
//引入网络库
import {get, post, upload, download} from "../../utils/network.js"
Page({
    data: {
        result: '返回结果',
    },
    loadGet(){
        get("/posts/1").then(data=>{
            this.setData({result:JSON.stringify(data)});
        })
    },
    loadPost(){
        post("/posts").then(data=>{
            this.setData({result:JSON.stringify(data)});
        })

    },
})
