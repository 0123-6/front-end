<template>
  <!--最外层-->
  <div class="flex align-center font-size-12 color-title-2">
    <span style="margin-right: 44px;">北京治数科技有限公司</span>
    <a href="http://beian.miit.gov.cn/" target="_blank" >京ICP备2022021810号-{{id}}</a>
  </div>
</template>

<script>
export default {
  name: "RecordCom",
  computed:{
    id(){
      const url = location.href
      return url.indexOf('model-os.com') === -1 ? 11 : 12;
    }
  }
}
</script>

<style scoped>

</style>
