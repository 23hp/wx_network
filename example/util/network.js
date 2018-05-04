/**
 * Created by 23hp on 2018/3/30.
 * 基于Promise的网络请求库,包含GET POST请求，上传下载功能
 * 使用方法：
 * 先引入： import {get,post,...} from 本文件;
 * · get请求:    get("/index",{id:2}).then(data=>{}).catch(error=>{});
 * · post请求:    post("/index",{id:2}).then(data=>{}).catch(error=>{});
 * Promise详细介绍：
 * http://es6.ruanyifeng.com/#docs/promise
 */

/**
 * 发起get请求
 * @param url 请求路径 必填
 * @param data 请求参数 get请求的参数会自动拼到地址后面
 */
export const get = (url, data) => request('GET', url, data);

/**
 * 发起post请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头
 */
export const post = (url, data, headers) => request('POST', url, data, headers);
/**
 * 发起put请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头
 */
export const put = (url, data, headers) => request('PUT', url, data, headers);
/**
 * 发起delete请求
 * @param url 请求路径 必填
 * @param data 请求参数 delete请求的参数会自动拼到地址后面
 */
export const del = (url, data) => request('DELETE', url, data);

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
            complete() {
                console.group('==============>请求开始<==============');
                console.info(method, url);
                if (response.success) {
                    console.info('请求成功', response.success);
                    resolve(response.success)
                } else {
                    console.info('请求失败', response.fail);
                    reject(response.fail)
                }
                console.info('==============>请求结束<==============');
                console.groupEnd();
            },
        });
    });
}
