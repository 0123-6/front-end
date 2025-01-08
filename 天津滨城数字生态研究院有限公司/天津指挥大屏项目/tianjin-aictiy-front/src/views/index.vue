<template>
  <!-- 最外层 -->
  <div class="flex flex-direction bgc-image-1" style="width: 1920px;min-height: 1080px;height:auto;padding-left: 20px;padding-right: 20px;">
    <!-- 上面菜单栏 -->
    <menu-bar v-show="drawingStatus == 0" style="width: 1880px;height: 68px;margin-top: 12px;z-index: 3;"></menu-bar>
    <keep-alive :include="keepAliveComponentList">
      <router-view name="default"></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name:'index',
  components: {
    MenuBar:()=>import("@/views/MenuBar"),
  },

  data() {
    return {
      keepAliveComponentList:['CityOverview','ModelList'],
    }
  },
  computed: {
    menuListIndex: {
      get() {
        return this.$store.state.menuListIndex
      },
      set(value) {
        this.$store.commit('setMenuListIndex', value)
      },
    },
    drawingStatus:{
      get(){
        return this.$store.state.indexPage.drawingStatus
      },
      set(value){
        this.$store.commit('indexPage/setDrawingStatus',value)
      },
    },
  },
  created() {
    if(this.$route.name==='modelBaseDetail' && this.menuListIndex!==2){
      this.menuListIndex = 2
    }
  },
}

</script>

<style scoped>

</style>
