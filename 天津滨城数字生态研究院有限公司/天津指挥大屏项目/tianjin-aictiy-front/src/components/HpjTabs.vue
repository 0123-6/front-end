<template>
  <div class="flex align-center">
    <div
        v-for="(item, index) in tabList"
        :key="index"
        class="flex justify-center align-center hand"
        style="width: 112px;height: 38px;"
        :class="[item == activeTab ? 'color-white' : 'color-white']"
        :style="[{ 'border-top': item == activeTab ? '3px solid #1396f0' : '3px solid #00477f', 'background-color': item == activeTab ? '#013972' : '#00477f' }]"
        @click="changeActiveTab(item)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HpjTabs',
  props: {
    tabList: {
      type: Array,
      required: true
    },
  },
  data(){
    return{
      activeTab:'',
    }
  },
  created() {
    if (this.activeTab === '') {
      this.activeTab = this.tabList[0];
    }
  },
  methods: {
    changeActiveTab(activeTab) {
      this.activeTab = activeTab;
      this.$emit('change', activeTab);
    }
  }
};
</script>

<style scoped>
</style>
