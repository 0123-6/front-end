const state = {
  isHeight: false
};

const mutations = {
  ADD_HEIGHT: (state, msg) => {
    state.isHeight = msg.height;
  },
  CLEAR_HEIGHT: (state, msg) => {
    state.isHeight = msg.height;
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
