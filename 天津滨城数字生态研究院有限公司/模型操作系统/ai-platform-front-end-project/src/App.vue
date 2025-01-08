<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-29 13:55:09
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-16 11:07:26
 * @FilePath: \ai-platform-front-end-project\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import { getLabelStudioToken } from '@/api/data-set'
// import axios from 'axios'
export default {
  name: 'App',
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
  },

  mounted() {
    // this.getLabelStudioToken()
  },
  methods: {
    // getLabelStudioToken() {
    //   getLabelStudioToken().then(item => {
    //     console.log(item)
    //   })
    // }
  }
};
</script>
