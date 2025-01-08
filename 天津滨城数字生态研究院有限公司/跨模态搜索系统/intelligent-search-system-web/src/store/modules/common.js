const state = {
  user_info: {},
  location_dict: [],
  orientation_dict: [],
  device_type_dict: [],
  protocol_type_dict: [],
  search_keyword: ''
};

const mutations = {
  ADD_USER_INFO: (value, msg) => {
    state.user_info = msg;
  },
  ADD_LOCATION_DICT: (value, msg) => {
    state.location_dict = msg;
  },
  ADD_ORIENTATION_DICT: (value, msg) => {
    state.orientation_dict = msg;
  },
  ADD_DEVICE_TYPE_DICT: (value, msg) => {
    state.device_type_dict = msg;
  },
  ADD_PROTOCOL_TYPE_DICT: (value, msg) => {
    state.protocol_type_dict = msg;
  },
  setSearchKeyword: (value, msg) => {
    state.search_keyword = msg;
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
