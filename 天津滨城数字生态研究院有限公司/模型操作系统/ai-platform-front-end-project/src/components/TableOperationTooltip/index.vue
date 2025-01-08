<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-23 13:51:11
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-23 17:15:57
 * @FilePath: \ai-platform-front-end-project\src\components\TableOperationTooltip\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="table-operation-tooltip-container">
    <el-tooltip v-model="isHover" effect="dark" :content="tooltipTitle" manual placement="top">
      <img
        :ref="svgRef"
        class="tooltip-icon"
        :src="iconUrl"
        alt=""
        :style="{'width': iconWidth, 'height': iconHeight, 'cursor': iconDisabled ? 'not-allowed' : 'pointer'}"
        @mouseenter="showHover"
        @mouseleave="hiddenHover"
        @click="showClick"
      >
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    iconClass: {
      type: String,
      required: true
    },
    tooltipTitle: {
      type: String,
      required: true
    },
    iconWidth: {
      type: String,
      default: '20px'
    },
    iconHeight: {
      type: String,
      default: '20px'
    },
    iconDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      svgRef: '',
      isHover: false,
      isClick: false
    };
  },
  computed: {
    iconUrl() {
      if (this.iconDisabled) {
        return require(`@/assets/images/table/${this.iconClass}-disable.svg`);
      } else if (this.isClick) {
        return require(`@/assets/images/table/${this.iconClass}-click.svg`);
      } else if (this.isHover) {
        return require(`@/assets/images/table/${this.iconClass}-hover.svg`);
      } else {
        return require(`@/assets/images/table/${this.iconClass}-normal.svg`);
      }
    }
  },
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    showHover() {
      this.isHover = true;
    },
    hiddenHover() {
      this.isHover = false;
    },
    showClick() {
      this.svgRef = `svg${new Date().getTime()}`;
      this.isClick = true;
      this.isHover = false;
      this.$emit('tooltipClick');
    },
    // enter事件销毁
    enterKeyupDestroyed() {
      document.removeEventListener('click', (ev) => { this.enterKey(ev); });
    },
    // enter事件注册
    enterKeyup() {
      document.addEventListener('click', (ev) => { this.enterKey(ev); });
    },
    enterKey(e) {
      if (e.target === this.$refs[this.svgRef]) {
        this.isClick = true;
      } else {
        this.isClick = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-operation-tooltip-container {
  display: inline-block;
  .tooltip-icon {
    &:hover {
      background-color: #E6EBEF !important;
      border-radius: 4px;
    }
  }
}
</style>
