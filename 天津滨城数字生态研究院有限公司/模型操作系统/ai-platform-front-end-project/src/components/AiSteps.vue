<template>
  <el-steps :active="active" style="width: 100%;" align-center>
    <el-step
      v-for="(item,index) in steps"
      :key="index"
      :title="item"
      :class="active==index?'active':active>index?'is-finish':'no-active'"
    />
  </el-steps>
</template>

<script>
export default {
  name: "AiSteps",
  props:{
    active:{
      type:Number,
      required:true,
    },
    steps:{
      type:Array,
      required: true,
    }
  },
}
</script>

<style scoped lang="scss">
::v-deep{
  .el-step__icon-inner {
    display: inline-block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    font-weight: 400;
    color: white;
    font-size: 13px;
    letter-spacing: 0;
    line-height: 13px;
  }
  .el-step__title {
    font-weight: 400;
    font-size: 14px;
  }
  .el-step__title.is-wait {
    color: #8c8c8c;
  }
  .el-step.is-horizontal .el-step__line {
    top: 20px;
  }
  .el-step__line-inner {
    height: 6px !important;
    border-width: 0px !important;
    width: 100% !important;
  }

  .el-step.is-center .el-step__line {
    height: 0px;
  }
  .active{
    .el-step__line-inner {
      background: #e9e9e9 !important;
    }
  }

  .no-active {
    .el-step__icon {
      width: 45px;
      height: 45px;
      border: 6px solid #f6f6f6 !important;
      background-color: #cacaca;
    }

    .el-step__title {
      color: #8c8c8c;
      font-weight: 400;
      font-size: 14px;
    }
    .el-step__line-inner {
      background: #e9e9e9 !important;
    }
  }

  .is-finish{
    .el-step__line-inner {
      background: #0164FF !important;
    }
  }

  .active .el-step__icon, .is-finish .el-step__icon {
    width: 45px;
    height: 45px;
    border: 6px solid #eaf2ff !important;
    background-color: #0164FF;
  }
  .active .el-step__title, .is-finish .el-step__title {
    color: #0164FF;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
