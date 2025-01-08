import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import tagsView from './modules/tagsView';
import settings from './modules/settings';
import user from './modules/user';
import modelBase from './modules/model-base';
import dataSet from './modules/data-set';
import modelPush from './modules/model-push';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    settings,
    user,
    modelBase,
    dataSet,
    modelPush
  },
  getters
});

export default store;
