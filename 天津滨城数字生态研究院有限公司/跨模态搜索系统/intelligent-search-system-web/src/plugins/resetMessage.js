// 重置message，防止重复点击重复弹出message弹框
import { Message } from 'element-ui';

let messageDom = null;
const resetMessage = (options) => {
  if (messageDom) messageDom.close(); // 判断弹窗是否已存在,若存在则关闭
  messageDom = Message(options);
};
// message类型
const typeArr = ['success', 'error', 'warning', 'info'];
typeArr.forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options.message = options;
    }
    options.type = type;
    return resetMessage(options);
  };
});
export const myMessage = resetMessage;
