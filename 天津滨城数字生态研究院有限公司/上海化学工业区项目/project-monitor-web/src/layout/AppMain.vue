<template>
  <section class="app-main full-w full-h relative y-auto">
    <router-view v-slot="{ Component }">
      <keep-alive :include="include">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      include: [
        'Index',
        'ProjectList',
        'ProjectTrend',
        'CheckAnalysis',
        'CheckList',
        'PolicyList',
        'MessageList'
      ]
    }
  },
  // 路由变化时，滚动条回到顶部
  watch: {
    $route() {
      this.$nextTick(() => {
        const main = document.querySelector('.app-main')
        if (main) {
          main.scrollTop = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
