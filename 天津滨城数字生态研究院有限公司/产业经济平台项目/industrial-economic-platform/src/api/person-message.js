/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-07-19 17:53:18
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-20 09:51:02
 * @FilePath: \industrial-economic-platform\src\api\user-manager.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export const personApis = {
  // 修改昵称
  editNick: (data) => request({
    url: '/user/profile/nickname',
    method: 'put',
    data
  }),
  // 修改邮箱
  editEmail: (data) => request({
    url: '/user/profile/email',
    method: 'put',
    data
  }),
  // 修改密码
  editPassword: (data) => request({
    url: '/user/profile/password',
    method: 'put',
    data
  }),
  // 修改头像
  editAvatar: (data) => request({
    url: '/user/profile/avatar',
    method: 'put',
    data
  })
};
