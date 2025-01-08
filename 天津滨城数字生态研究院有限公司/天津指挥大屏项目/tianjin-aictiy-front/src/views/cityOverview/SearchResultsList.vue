<template>
  <div class="flex flex-direction" style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));width: 499px;">
    <!-- 关闭按钮 -->
    <div style="position: absolute;z-index: 2;height: 30px;width: 499px;">
      <div class="flex justify-end align-center">
        <close-icon @close="clearSearchResult"></close-icon>
      </div>
    </div>
    <div class="flex flex-direction flex-1" style="height: 0px;overflow-y: scroll;margin-top: 30px;">
      <!-- 搜索结果 -->
      <div v-if="!searching && searchResult.length != 0" @click="clickSearchItem(item)" class="flex justify-around align-center hand my-border-when-hover"
           style="border: 1px solid rgba(75,132,192,0.1);border-bottom: 1px solid #0F366D;"
           v-for="(item,index) in searchResult" :key="index">
        <!-- 左 -->
        <div class="flex justify-center align-center" style="width: 50%;height: 100%;padding: 5px;">
          <img :src="'http://47.93.19.134:9068'+item.image" width="206" height="115">
        </div>
        <!-- 右 -->
        <div class="flex flex-direction justify-around" style="width: 50%;height: 100%;padding-left: 20px">
          <!-- 上 -->
          <div class="text-hidden-3 color-white"
               :title="item.streetName.length>36?item.streetName:null"
               style="font-size: 18px;font-weight: 400;">
            {{ item.streetName }}
          </div>
          <!-- 下 -->
          <div class="flex" style="font-size: 16px;font-weight: 400;color: #9EB5CD;">
            {{ item.time }}
          </div>
        </div>
      </div>
      <!--加载效果-->
      <div v-if="searching" class="flex justify-center align-center" style="width: 100%;min-height: 266px;height: 100%;">
        <div class="flex flex-direction align-center">
          <div class="loading-small"></div>
        </div>
      </div>
      <!-- 没有搜索结果显示默认图片 -->
      <div class="flex justify-around align-center"
           v-show="searchResult!==undefined && typeof searchResult == 'object' && searchResult.length == 0 && !searching"
           style="background-color: #002C50;margin-top: 8px;">
        <img src="/image/noResult.jpg">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResultsList",
  components:{
    CloseIcon:()=>import('@/components/CloseIcon')
  },
  data(){
    return{
    }
  },
  computed:{
    searchResult:{
      get(){
        return this.$store.state.indexPage.searchResult
      },
      set(value){
        this.$store.commit('indexPage/setSearchResult',value)
      },
    },
    searching:{
      get(){
        return this.$store.state.indexPage.searching
      },
    },
  },
  methods:{
    clearSearchResult() {
      this.searchResult = []
      this.$store.commit('indexPage/setSearched',false)
      this.$emit('mapClearOverlays')
    },
    clickSearchItem(item) {
      this.$store.commit('indexPage/setShowMoastData',item)
      this.$store.commit('indexPage/setMoastShowMode','车流量信息')
      this.$emit('clickSearchItem')
    },
  },
}
</script>

<style scoped>

</style>
