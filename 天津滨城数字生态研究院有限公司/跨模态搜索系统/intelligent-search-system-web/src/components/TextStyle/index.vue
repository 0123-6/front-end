<!--一条蓝线 + 标题 组件-->
<template>
  <!--最外层-->
  <div class="title-container" >
    <!--左-->
    <div class="title-content">
      <div class="title-icon" :style="[{'height':fontSize?fontSize+'px':'14px',}]" />
      <div class="title" :style="[{'font-size':fontSize?fontSize+'px':'14px',}]">
        {{ title }}
      </div>
    </div>
    <!--右-->
    <div class="flex align-center">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'TitleStyle',
  props: {
    title: {
      type: String,
      required: true
    },
    notMarginBottom: {
      type: Boolean,
      required: false
    },
    fontSize: {
      type: Number,
      default: 0,
      required: false
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.title-container{
  &:extend(.align-center);
  justify-content: space-between;
  .title-content{
    &:extend(.align-center);
    .title-icon{
      background: @primary-color;
      width: 3px;
      margin-right: 8px;
    }
    .title{
      font-family: SourceHanSansSC-Medium;
      font-size: 16px;
      color: @text-primary-dark;
      font-weight: 500;
    }
  }
}
</style>
