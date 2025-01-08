<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-10 12:08:49
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-12-06 10:31:11
 * @FilePath: \company-template\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  position: relative;
  height: 100%;
  color: #1a262c;
  font-size: 14px;
}
* {
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
