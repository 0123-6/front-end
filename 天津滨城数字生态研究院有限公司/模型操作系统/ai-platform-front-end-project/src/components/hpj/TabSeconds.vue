<template>
  <!--最外层-->
  <div
    class="flex align-center font-size-14 color-content border-radius-4"
    style="background-color:#f7f7f7;height: 38px;padding-left: 6px;padding-right: 6px;"
  >
    <div
      v-for="(item,index) in tabList"
      :key="index"
      class="flex align-center padding-left-24 padding-right-24 hand border-radius-4"
      :class="[item===currentTab?'color-title':'',index!=tabList.length-1?'margin-right-16':'']"
      style="height: 28px;"
      :style="{'background-color':item===currentTab?'#e9eaec':''}"
      @click="changeCurrentTab(item)"
    >
      {{item}}
    </div>
  </div>
</template>

<script>
export default {
  name: "TabSeconds",
  props: {
    tabList: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: false,
      default: '',
    },
  },
  data(){
    return{
      currentTab:null,
    }
  },
  created() {
    if(this.activeTab){
      this.currentTab = this.activeTab
    }else {
      this.currentTab = this.tabList[0]
    }

  },
  methods: {
    changeCurrentTab(currentTab) {
      this.currentTab = currentTab;
      this.$emit('change', currentTab);
    }
  }
}
</script>

<style scoped>

</style>
