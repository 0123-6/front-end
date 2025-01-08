/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-12-05 10:14:14
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:22:57
 * @FilePath: \intelligent-search-system-web\src\store\getters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const getters = {
  TOKEN: (state) => state.Common.token,
  USER_INFO: (state) => state.Common.user_info,
  ROUTER_TAGS: (state) => state.Common.router_tags,
  MENU_TREE: (state) => state.Common.menu_tree,
  META_MENU: (state) => state.Common.meta_menu,
  CITY_OPTIONS: (state) => state.Common.city_options
};
export default getters;
