/**
 * 此文件管理项目所有接口
 */
import {get, post, put, del} from './network';

/**
 * 服务器根域名
 * 试玩更多接口看这里
 * http://jsonplaceholder.typicode.com/
 * @type {string}
 */
export const API_ROOT = 'https://jsonplaceholder.typicode.com';


/**
 * 获取图片
 */
export const getPhoto = (id) => get(`${API_ROOT}/photos/${id}`);

