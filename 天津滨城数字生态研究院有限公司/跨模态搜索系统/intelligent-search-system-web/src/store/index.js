import Vue from 'vue';
import Vuex from 'vuex';
import getters from '@/store/getters';
import Common from '@/store/modules/common';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Common
  },
  getters
});

export default store;
