/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-29 11:12:18
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:15:43
 * @FilePath: \template\src\api\common.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function logout(params) {
  return request({
    url: '/logout',
    method: 'delete',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  });
}

export function getUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  });
}

export function refreshToken() {
  return request({
    url: '/refreshToken',
    method: 'post'
  });
}

export function uploadFile(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  });
}

export function getMetaMenuData() {
  return request({
    url: '/role/menu/meta',
    method: 'get'
  });
}

export function getMenuTreeData() {
  return request({
    url: '/menu/tree',
    method: 'get'
  });
}

export function getRegionTreeData() {
  return request({
    url: '/regin/tree',
    method: 'get'
  });
}
