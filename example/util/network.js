/**
 * Created by 23hp on 2017/4/13.
 * 基于Promise的网络请求库,包含GET POST请求，上传下载功能
 * 使用方法：
 * 先引入： import {get,post,...} from 本文件;
 * · get请求:    get("/index",{id:2}).then(data=>{}).catch(error=>{});
 * · post请求:    post("/index",{id:2}).then(data=>{}).catch(error=>{});
 *  then方法里的参数第一个是成功回调，第二个是失败回调，两个回调都是可选的
 */

/**
 * 服务器根路径
 * @type {string}
 */
export let rootUrlProduce = "http://jsonplaceholder.typicode.com";//生产环境
export let rootUrlTest = "http://jsonplaceholder.typicode.com";//测试环境
/**
 * 发送get 请求
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise}
 */
export function get(relativeUrl, param,header) {
    return request("GET", relativeUrl, param,header);
}
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

/**
 * 接口请求基类方法
 * @param method 请求方法 必填
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise}
 */
export function request(method, relativeUrl, param , header = {'Content-Type': 'application/json'}) {

    let response,error;

    return new Promise((resolve, reject) => {
        wx.request({
            url: rootUrlProduce + relativeUrl,
            method: method,
            header: header,
            data: param || {},
            success (res) {
                response= res.data;
                resolve(res.data);
            },
            fail (data) {
                error=data;
                reject(data);
            },
            complete () {
                console.info('==============>请求开始<==============');
                console.warn(method, rootUrl + relativeUrl);
                if(param) console.warn('参数：', param);
                if(response){
                    console.warn("返回成功：",response);
                }else {
                    console.warn("返回失败：",error);
                }
                console.info('==============>请求结束<==============');

            }

        });
    });
}