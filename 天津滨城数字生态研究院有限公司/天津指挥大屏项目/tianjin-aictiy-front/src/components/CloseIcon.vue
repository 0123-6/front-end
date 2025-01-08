<template>
  <div @click="close" @mouseover="changeColorClose" @mouseout="resetColorClose"
       class="flex justify-center align-center hand" style="width: 30px;height: 30px;">
    <Icon type="md-close" :color="colorClose" size="26"/>
  </div>
</template>

<script>
export default {
  name: "CloseIcon",
  data(){
    return{
      colorClose: '#158acc',
    }
  },
  methods:{
    changeColorClose() {
      this.colorClose = '#72a9e4'
    },
    resetColorClose() {
      this.colorClose = '#158acc'
    },
    close(){
      this.$emit('close')
      this.resetColorClose()
    },
  }
}
</script>

<style scoped>

</style>