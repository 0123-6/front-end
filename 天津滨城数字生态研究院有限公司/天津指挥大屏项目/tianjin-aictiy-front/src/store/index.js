import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import indexPage from "@/store/indexPage";
import monitorPage from "@/store/monitorPage";

export default new Vuex.Store({
  state: {
    menuListIndex:0,
    menuListHoverIndex:0,
    myCircle:null,//在地图上画出的圆，3个属性，lng，lat，radius
    earlyInfo:null,//上一个页面传过来的参数
  },
  getters: {
  },
  mutations: {
    init(state){
      state.menuListIndex = 0
      state.menuListHoverIndex = 0
      state.myCircle = null
      state.earlyInfo = null
    },
    setMenuListIndex(state,value){
      state.menuListIndex = value
    },
    setMenuListHoverList(state,value){
      state.menuListHoverIndex = value
    },
    setMyCircle(state,payload){
      state.myCircle = {}
      state.myCircle.lng = payload.lng
      state.myCircle.lat = payload.lat
      state.myCircle.radius = payload.radius
    },
    setEarlyInfo(state,value){
      state.earlyInfo = value
    },
  },
  actions: {
  },
  modules: {
    indexPage,
    monitorPage,
  }
})
