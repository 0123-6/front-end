<template>
  <div class="home-container">
    <div class="main-container">
      首页...
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'home-page',
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.home-container {
  min-height: 100%;
  .main-container {
  }
}
</style>
