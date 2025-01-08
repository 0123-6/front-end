/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-21 09:07:04
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 09:41:36
 * @FilePath: \intelligent-search-system-web\src\api\search.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import qs from 'qs';
import request from '@/utils/request';

const baseUrl = 'https://mock.apifox.cn/m1/1919040-0-default';

function toUrl(params) {
  return `?${qs.stringify(params)}`;
}

/**
 * 根据关键字，获取历史记录
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getHistory(params) {
  return request({
    url: `/search-history${toUrl(params)}`,
    method: 'get'
  });
}

/**
 * 删除某项历史记录
 * @param params
 * @return {*}
 */
export function deleteHistory(params) {
  return request({
    url: `/search-history${toUrl(params)}`,
    method: 'delete'
  });
}

/**
 * 删除所有历史记录
 * @return {*}
 */
export function deleteAllHistory() {
  return request({
    url: '/search-history/clear',
    method: 'delete'
  });
}

/**
 * 根据关键字，搜索
 */
export function search(data) {
  return request({
    url: '/search',
    method: 'post',
    data
  });
}

/**
 * 根据关键字，获取高级搜索配置
 */
export function searchConfig() {
  return request({
    url: '/search/config',
    method: 'get'
  });
}

/**
 * 获取视频详情接口
 */
export function getVideoDetail(params) {
  return request({
    url: `/search/detail${toUrl(params)}`,
    method: 'get'
  });
}
