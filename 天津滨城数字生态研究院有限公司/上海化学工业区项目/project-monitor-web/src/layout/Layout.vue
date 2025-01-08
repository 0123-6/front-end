<template>
  <el-container class="app-wrapper full-h">
    <el-aside width="120px">
      <Sidebar />
    </el-aside>
    <el-main style="padding: 0;">
      <AppMain />
    </el-main>
  </el-container>
</template>

<script>
import Sidebar from './Sidebar'
import AppMain from './AppMain'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.app-wrapper {
  min-width: $--min-window-width;
  background-image: url('@/assets/images/bg.png');
  background-size: cover;
  background-position: 50%;
}
</style>
