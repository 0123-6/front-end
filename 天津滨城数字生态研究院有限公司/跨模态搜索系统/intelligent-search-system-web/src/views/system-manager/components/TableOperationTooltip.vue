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
  name: 'table-operation-tooltip',
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
      isFocus: false
    };
  },
  computed: {
    iconUrl() {
      let svgRef = '';
      if (this.iconDisabled) {
        svgRef = require(`@/assets/images/table/${this.iconClass}-disable.svg`);
      } else if (this.isFocus) {
        svgRef = require(`@/assets/images/table/${this.iconClass}-focus.svg`);
      } else if (this.isHover) {
        svgRef = require(`@/assets/images/table/${this.iconClass}-hover.svg`);
      } else {
        svgRef = require(`@/assets/images/table/${this.iconClass}-normal.svg`);
      }
      return svgRef;
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
      this.isFocus = true;
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
        this.isFocus = true;
      } else {
        this.isFocus = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.table-operation-tooltip-container {
  display: inline-block;
  .tooltip-icon {
    &:hover {
      background-color: #E6EBEF !important;
      border-radius: 4px;
    }
  }
  & + .table-operation-tooltip-container {
    margin-left: 8px;
  }
}
</style>
