/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-19 17:38:39
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-10 11:17:06
 * @FilePath: \ai-platform-front-end-project\src\store\modules\data-set.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const state = {
  IDList: [],
  pageNumber: 1
};

const mutations = {
  ADD_ID_LIST: (state, msg) => {
    if (msg.tableData.length > 0) {
      msg.tableData.map((item) => {
        state.IDList.push(item.id);
      });
      state.pageNumber = msg.pageNum;
    }
  },
  CLEAR_ID_LIST: (state, msg) => {
    state.IDList = [];
    state.pageNumber = 1;
  }
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
