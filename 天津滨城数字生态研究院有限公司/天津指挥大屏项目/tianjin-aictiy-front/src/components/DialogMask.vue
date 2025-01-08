<template>
  <!--最外层-->
  <div class="flex" style="width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 10;background-color:#0b141ba6;" @click="cancel">
    <div v-dialogDrag @click.stop="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogMask",
  data(){
    return{
      show:true,
    }
  },
  methods:{
    //取消按钮，关闭弹框
    cancel(){
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>

</style>
