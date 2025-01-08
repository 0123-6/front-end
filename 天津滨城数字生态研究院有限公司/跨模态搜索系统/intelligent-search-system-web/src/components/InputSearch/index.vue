<template>
  <el-input
    ref="focusInput"
    class="input-container"
    :placeholder="placeholder"
    v-model="value"
    @focus="changeOperateStatus(true)"
    @blur.capture="changeOperateStatus(false)"
    @keyup.enter.native="search"
  >
    <div slot="prefix">
      <img
        class="tooltip-icon title-container"
        src="@/assets/icons/search.svg"
        alt=""
      >
    </div>
    <div v-show="value" slot="suffix">
      <close-svg width="18" height="18" v-show="value" class="el-icon-close" @mousedown.native="cleanValue"></close-svg>
      <el-divider direction="vertical"></el-divider>
      <el-button @mousedown.native="search">搜索</el-button>
    </div>
  </el-input>
</template>

<script>
import CloseSvg from '@/components/SvgIcon/CloseSvg';

export default {
  name: 'InputSearch',
  components: {
    CloseSvg
  },
  props: {
    SearchValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: this.SearchValue,
      isFocus: false
    };
  },
  methods: {
    search() {
      this.$emit('ok', this.value);
    },
    cleanValue() {
      this.value = '';
      this.$emit('ok', this.value);
    },
    changeOperateStatus(bool, type) {
      if (bool) {
        this.$nextTick(() => {
          this.isFocus = true;
        });
      } else {
        this.isFocus = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/styles/element-ui.less";
.input-container{
  width: 1200px;
  height: 56px;
  background: #cedceb;
  border-radius: 8px;
  &:extend(.flex-center);
  ::v-deep .el-input__inner{
    width: 1196px;
    height: 52px;
    line-height: 52px;
    background: #FFFFFF;
    border: 1px solid rgba(255,255,255,1);
    border-radius: 4px;
    &:focus{
      border: 1px solid rgba(12,97,170,0.13);
      border-radius: 8px;
    }
  }
  ::v-deep .el-input__prefix{
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  ::v-deep .el-input__inner{
    padding-left: 40px;
  }
  ::v-deep .el-input__suffix-inner{
    >div{
      &:extend(.align-center);
    }
  }
  ::v-deep .el-input__suffix{
    &:extend(.align-center);
    .el-divider--vertical{
      height: 2em;
    }
    .el-button{
      width: 80px;
      height: 40px;
      margin: 0 20px;
      background: #0C61AA;
      box-shadow: 0 4px 8px 0 rgba(12,97,170,0.31);
      border-radius: 6px;
      font-family: SourceHanSansSC-Medium;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
}
</style>
