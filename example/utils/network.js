/**
 * Created by 23hp on 2017/4/13.
 * 基于Promise的网络请求库,包含GET POST请求，上传下载功能
 * 使用方法：
 * 先引入： import {get,post,...} from 本文件;
 * · get请求:    get("/index",{id:2}).then(function(succeedData){},function(failedData){});
 * · post请求:    post("/index",{id:2}).then(function(succeedData){},function(failedData){});
 *  then方法里的参数第一个是成功回调，第二个是失败回调，两个回调都是可选的
 */

/**
 * 服务器根路径
 * todo  替换成你自己的
 * @type {string}
 */
export let rootUrl = "http://jsonplaceholder.typicode.com";
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
/**
 * 发送POST请求
 * @param relativeUrl 相对路径
 * @param param 参数，可选
 * @param showLog 是否打印日志
 * @param showLoading 是否显示加载框
 * @param showError 是否显示错误框
 * @returns {Promise}
 */
export function post(relativeUrl, param = {}, showLog = false, showLoading = true, showError = true) {
    return request("POST", relativeUrl, param, showLog, showLoading, showError);
}

/**
 * 接口请求基类方法
 * @param method 请求方法
 * @param relativeUrl 相对路径
 * @param param 参数，可选
 * @param showLog 是否打印日志
 * @param showLoading 是否显示加载框
 * @param showError 是否显示错误框
 * @returns {Promise}
 */
function request(method = "GET", relativeUrl, param = {}, showLog = false, showLoading = true, showError = true) {
    if (showLoading) wx.showLoading({title: '加载中',});
    if (showLog) {
        console.log(method, rootUrl + relativeUrl);
        console.log("参数:", param);
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: rootUrl + relativeUrl,
            method: method,
            header: {'content-type': 'application/x-www-form-urlencoded'},//按实际需求修改header
            data: param || {},
            success (res) {
                resolve(res.data);
                if (showLog) console.log("服务器返回数据：", res.data);
            },
            fail (data) {
                reject(data);
                if (showLog) console.log("连接服务器失败：", data);
                if (showError) wx.showToast({title: '连接服务器失败', image: '/image/warn.png'});
            },
            complete () {
                if (showLoading) wx.hideLoading();
            }

        });
    });
}
/**
 * 下载文件
 * @param url 远程文件地址
 * @param showLoading 是否显示加载框
 * @returns {Promise}
 */
export function download(url = "", showLoading = true) {
    if (showLoading) wx.showLoading({title: '加载中',});
    return new Promise((resolve, reject) => {
        wx.downloadFile({
            url: url,
            success(res) {
                resolve(res.tempFilePath);
            },
            fail(res){
                reject(res);
            },
            complete(){
                if (showLoading) wx.hideLoading();
            }
        })

    });
}

/**
 * 上传文件
 * todo【注意】请确认上传路径
 * @param resPath 文件路径
 * @param showLoading 是否显示加载框
 * @returns {Promise}
 */
export function upload(resPath, showLoading = true) {
    if (showLoading) wx.showLoading({title: '资源上传中',});
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: rootUrl + "/user/upload",
            filePath: resPath,
            name: 'file',
            success(res){
                console.log(res);
                let data = JSON.parse(res.data);
                if (data.status && data.status.succeed == 1) {
                    let voiceUrl = data.data.link;
                    resolve(voiceUrl);
                } else {
                    reject(res.data);
                }
            },
            fail(error){
                reject(error);
            },
            complete(){
                if (showLoading) wx.hideLoading();
            }
        });
    });
}