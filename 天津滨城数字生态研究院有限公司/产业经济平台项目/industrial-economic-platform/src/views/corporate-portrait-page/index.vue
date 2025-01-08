<script>
import { defineComponent } from 'vue';
import CorporatePortraitComponent from '@/components/CorporatePortraitComponent/index.vue';

export default defineComponent({
  name: 'CorporatePortrait',
  components: {
    CorporatePortraitComponent
  },
  methods: {}
});
</script>

<template>
  <div class="container">
    <div class="ee-view-content">
      <CorporatePortraitComponent />
    </div>
  </div>
</template>

<style scoped lang="less">
</style>
