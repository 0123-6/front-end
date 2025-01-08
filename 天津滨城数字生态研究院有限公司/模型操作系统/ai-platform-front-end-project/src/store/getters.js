/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-10 18:05:09
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-20 14:56:23
 * @FilePath: \ai-platform-front-end-project\src\store\getters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roleName: state => state.user.roleName,
  userId: state => state.user.userId,
  menuList: state => state.user.menuList,
  menuNameList: state => state.user.menuNameList,
  whiteMenuList: state => state.user.whiteMenuList,
  operationPermissionsList: state => state.user.operationPermissionsList,
  IDList: state => state.dataSet.IDList,
  pageNumber: state => state.dataSet.pageNumber,
  isHeight: state => state.modelPush.isHeight,
  grafanaUrl: state => state.user.grafanaUrl,
  kubeflowUrl: state => state.user.kubeflowUrl,
  labelStudioUrl: state => state.user.labelStudioUrl
};
export default getters;
