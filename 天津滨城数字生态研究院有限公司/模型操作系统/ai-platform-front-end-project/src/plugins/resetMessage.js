/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-08-10 14:20:03
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-10 14:20:20
 * @FilePath: \ai-platform-front-end-project\src\utils\resetMessage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 重置message，防止重复点击重复弹出message弹框
import { Message } from 'element-ui';

let messageDom = null;
const resetMessage = (options) => {
  if (messageDom) messageDom.close(); // 判断弹窗是否已存在,若存在则关闭
  messageDom = Message(options);
};
// message类型
const typeArr = ['success', 'error', 'warning', 'info'];
typeArr.forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') options = { message: options };
    options.type = type;
    return resetMessage(options);
  };
});
export const myMessage = resetMessage;
