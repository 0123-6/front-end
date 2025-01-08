/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-12-05 10:14:14
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-07 17:24:15
 * @FilePath: \intelligent-search-system-web\src\store\getters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getters = {
  iep_platform_USER_INFO: (state) => state.Common.iep_platform_user_info,
  iep_platform_TOKEN: (state) => state.Common.iep_platform_token,
  iep_platform_ROUTERS_INFO: (state) => state.Common.iep_platform_routers_info,
  iep_platform_SEARCH_INFO: (state) => state.Common.iep_platform_search_info,
  iep_platform_MENU_ID: (state) => state.Common.iep_platform_menu_id,
  iep_menuMap: (state) => state.menu.menuMap,
  iep_permissions: (state) => state.menu.permissions,
  iep_orgRegion: (state) => state.user.orgRegion,
};
export default getters;
