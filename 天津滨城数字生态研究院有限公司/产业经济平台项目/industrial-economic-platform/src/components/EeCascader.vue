<template>
  <div
    class="ee-cascader d-flex"
    :class="{
      'is-open': visible,
      'is-single': !multiple,
      'has-value': hasInputValue,
      'is-button-mode': buttonMode,
      'is-clearable': clearable,
      'is-reverse': direction === 'reverse'
    }">
    <div class="ee-cascader__inner" :style="{ width: width === '100%' ? '100%' : 'auto' }">
      <template v-if="buttonMode">
        <el-button v-popover:popover class="ee-button" size="small" type="primary" icon="el-icon-plus" plain>{{ placeholder }}</el-button>
      </template>
      <template v-else>
        <el-input
          ref="input"
          v-popover:popover
          :class="{ 'is-up': visible }"
          :placeholder="placeholder"
          v-model="inputValue"
          readonly
          :disabled="disabled"
          suffix-icon="el-icon-arrow-down"
          :style="{ width: inputWidth }">
        </el-input>
        <i v-if="clearable && hasInputValue" class="el-icon-circle-close clear-value" @click="handleClear"></i>
      </template>
    </div>
    <el-button v-show="clearable && showTagList && valueTagList.length > 0" class="ee-cascader__clear" size="small" type="text" @click="handleClear">
      清除
    </el-button>
    <div v-if="showTagList && multiple" class="value-list d-flex ai-start flex-wrap flex-1">
      <div v-for="(n, i) in valueTagList" :key="n.value" class="d-flex ai-center c-tag-item">
        {{ n.label }}
        <i class="el-icon-close" @click="removeValueTag(i)"></i>
      </div>
    </div>
    <slot></slot>
    <el-popover
      ref="popover"
      :popper-class="'is-ee-cascader is-bordered' + (isolateRoot ? ' isolate-root' : '')"
      v-model="visible"
      placement="bottom"
      title="-"
      width="700"
      :trigger="buttonMode ? 'click' : 'focus'">
      <div class="d-flex">
        <div
          v-if="isolateRoot"
          class="item root-node"
          :class="{
            'is-active': isNodeActive(options[0]),
            'is-selected': isNodeSelected(options[0]),
            'is-disabled': isNodeDisabled(options[0])
          }"
          @click="
            levelId = '1';
            handleNodeClick(options[0]);
          ">
          {{ options[0][labelProp] }}
        </div>
      </div>
      <div class="tabs d-flex ai-center">
        <div
          class="tabs-item"
          v-for="l in levels"
          :key="l"
          :id="`tab-${l}`"
          :class="{ 'is-active': levelId === l.toString() }"
          @click="levelId = l.toString()">
          {{ levelTitles[l - 1] }}
        </div>
      </div>
      <div class="tabs-content">
        <div class="d-flex ai-center flex-wrap" v-for="l in levels" :key="l" :id="`pane-${l}`" v-show="levelId === l.toString()">
          <div
            v-for="n in levelDatas[l]"
            :key="n[valueProp]"
            class="item"
            :class="{
              'is-active': isNodeActive(n),
              'is-selected': isNodeSelected(n),
              'is-disabled': isNodeDisabled(n)
            }"
            @click="handleNodeClick(n)">
            {{ n[labelProp] }}
          </div>
        </div>
        <div v-show="options.length === 0" class="nodata">暂无数据</div>
      </div>
      <div class="d-flex ai-center jc-end" style="margin-top: 10px">
        <el-button class="ee-button" size="small" @click="handleCancel">取 消</el-button>
        <el-button class="ee-button" size="small" type="primary" :disabled="disabled" @click="handleConfirm()" style="margin-left: 10px"
          >确 定</el-button
        >
      </div>
    </el-popover>
  </div>
</template>

<script>
/* eslint-disable */

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export default {
  name: 'EeCascader',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultValue: {
      type: Object,
      default() {
        return {};
      }
    },
    direction: {
      type: String,
      default: 'normal'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableValues: {
      type: Array,
      default() {
        return [];
      }
    },
    levelTitles: {
      type: Array,
      default() {
        return ['全国', '省份', '市', '区'];
      }
    },
    limit: {
      type: Number,
      default: 15
    },
    maxLevel: {
      type: Number,
      default: 3
    },
    // popper触发元素类型
    mode: {
      type: String,
      default: 'input'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 多选时是否展示选择结果
    showTagList: {
      type: Boolean,
      default: true
    },
    // true:已选的置灰不可选
    strictly: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '区域'
    },
    // 可选择的节点级别
    valueLevels: {
      type: Array,
      default() {
        return [0, 1, 2, 3];
      }
    },
    width: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      visible: false,
      levelId: '1',
      levels: 1,
      levelDatas: {},
      inputValue: '',
      checkedValue: [],
      checkedNodePath: [],
      valueTagList: [],
      isolateRoot: false
    };
  },
  computed: {
    defaultProps() {
      return Object.assign(
        {
          value: 'regionCode',
          label: 'regionName',
          level: 'regionLevel',
          children: 'children'
        },
        this.props
      );
    },
    buttonMode() {
      return this.mode === 'button';
    },
    valueProp() {
      return this.defaultProps.value;
    },
    labelProp() {
      return this.defaultProps.label;
    },
    levelProp() {
      return this.defaultProps.level;
    },
    childrenProp() {
      return this.defaultProps.children;
    },
    hasInputValue() {
      return !!this.inputValue;
    },
    inputWidth() {
      if (!this.autoResize) return this.width;
      const textWidth = this.inputValue.length * 14 + 45;
      return textWidth <= 198 ? 'auto' : `${textWidth}px`;
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log('EeCascader value change', JSON.parse(JSON.stringify(val)));
        if (!isEqual(val, this.checkedValue)) {
          this.checkedValue = val;
          this.computePresentContent();
        }
      },
      deep: true
    },
    checkedValue: {
      handler(val) {
        // console.log('EeCascader checkedValue change', val);
        const { value } = this;
        if (!isEqual(val, value)) {
          this.computePresentContent();
          this.$emit('input', val);
          this.$emit('change', val, this.checkedNodeList);
          // console.log('EeCascader change', val, this.checkedNodeList);
        }
      },
      deep: true
    },
    options: {
      handler(val) {
        // console.log('EeCascader options change', val);
        this.levels = 1;
        this.isolateRoot = this.judgeIsolateRoot(val);
        this.$set(this.levelDatas, 1, val);
        this.cacheNodes = this.flatNodes(val, false);
        this.handleIsolateRoot();
        this.$nextTick(this.computePresentContent);
        this.$emit('options-change', this.cacheNodes);
      },
      deep: true
    }
  },
  created() {
    const { options } = this;
    this.isolateRoot = this.judgeIsolateRoot(options);
    this.checkedNodeList = [];
    this.$set(this.levelDatas, 1, options);
    this.cacheNodes = this.flatNodes(options, false);
    this.handleIsolateRoot();
    this.$emit('options-change', this.cacheNodes);
  },
  methods: {
    judgeIsolateRoot(val) {
      return val[0] && val[0][this.levelProp] === 0;
    },
    handleIsolateRoot() {
      if (this.isolateRoot && this.levelId === '1') {
        this.handleNodeClick(this.options[0]);
      }
    },
    flatNodes(data, leafOnly) {
      return data.reduce((res, node) => {
        if (node[this.childrenProp].length === 0) {
          res.push(node);
        } else {
          !leafOnly && res.push(node);
          res = res.concat(this.flatNodes(node.children, leafOnly));
        }
        return res;
      }, []);
    },
    handleNodeClick(n, stop) {
      const { childrenProp, levelProp, multiple, maxLevel } = this;
      for (let i = 1; i <= this.levels; i++) {
        if (this.levelId === i.toString()) {
          this.checkedNodePath = this.checkedNodePath.filter((p, pi) => pi < i - 1).concat([n]);
          if (maxLevel > n[levelProp] && n[childrenProp].length > 0) {
            this.levels = 1 + Number(this.levelId);
            this.$set(this.levelDatas, this.levels, n[childrenProp]);
            if (!stop && (!multiple || (this.isolateRoot && this.levelId === '1'))) {
              this.levelId = (this.levels * 1).toString();
            }
          }
          break;
        }
      }
    },
    computePresentContent() {
      if (this.multiple) {
        this.computePresentTags();
      } else {
        this.computePresentText();
      }
    },
    computePresentTags() {
      const { checkedValue, valueProp, levelProp, labelProp } = this;
      if (checkedValue && checkedValue.length > 0) {
        if (this.cacheNodes.length > 0) {
          const nodeList = [];
          const valueTagList = [];
          checkedValue.forEach((item) => {
            const nodePath = [];
            const labelPath = [];
            item.forEach((p) => {
              const nodes = this.cacheNodes.filter((n) => n[valueProp] === p);
              const node = nodes[nodes.length - 1];
              nodePath.push(node);
              labelPath.push(node[labelProp]);
            });
            nodeList.push(nodePath);
            const level = nodePath[nodePath.length - 1][levelProp];
            const value = nodePath[nodePath.length - 1][valueProp];
            const label = this.getLabelPathText(labelPath);
            valueTagList.push({
              value,
              level,
              label
            });
          });
          this.valueTagList = valueTagList;
          this.checkedNodeList = nodeList;
        }
      } else {
        this.valueTagList = [];
        this.checkedNodeList = [];
      }
    },
    computePresentText() {
      const { checkedValue, valueProp, labelProp, autoResize } = this;
      if (checkedValue && checkedValue.length > 0) {
        if (this.cacheNodes.length > 0) {
          const nodePath = [];
          const labelPath = [];
          checkedValue.forEach((v) => {
            const nodes = this.cacheNodes.filter((n) => n[valueProp] === v);
            const node = nodes[nodes.length - 1];
            if (node) {
              labelPath.push(node[labelProp]);
              nodePath.push(node);
            }
          });
          const pathText = this.getLabelPathText(labelPath);
          this.inputValue = autoResize ? pathText : pathText.length > 10 ? pathText.substr(0, 10) + '...' : pathText;
          // this.inputValue = labelPath[labelPath.length - 1];
          this.checkedNodeList = nodePath;
          if (this.checkedNodePath.length !== checkedValue.length) {
            this.levelId = '1';
            nodePath.forEach((n, i) => {
              this.handleNodeClick(n, i > 0 && i === nodePath.length - 1);
            });
          }
        }
      } else {
        this.inputValue = '';
        this.checkedNodeList = [];
        this.checkedNodePath = [];
      }
    },
    getTextByNodePath(nodePath) {
      return this.getLabelPathText(nodePath.map((n) => n[this.labelProp]));
    },
    getLabelPathText(labelPath) {
      const { levelTitles } = this;
      return Array.from(new Set(labelPath))
        .filter((n) => n && (n != levelTitles[0] || labelPath.length === 1))
        .join('/');
    },
    getNode(val, list, arr) {
      const { labelProp, valueProp } = this;
      arr.push(
        list.find((n) => {
          n[valueProp] === val;
        })[labelProp]
      );
    },
    isNodeDisabled(n) {
      return n.disabled || this.disableValues.indexOf(n[this.valueProp]) > -1;
    },
    isNodeActive(n) {
      const { valueProp, checkedNodePath } = this;
      return !!checkedNodePath.find((p) => p[valueProp] === n[valueProp]);
    },
    isNodeSelected(n) {
      const { valueProp, multiple, checkedValue } = this;
      return multiple && checkedValue.find((v) => v[v.length - 1] === n[valueProp]);
    },
    filterNodePath(path) {
      const { valueProp } = this;
      const realPath = [];
      path.forEach((n) => {
        if (!realPath.find((p) => p[valueProp] === n[valueProp])) {
          realPath.push(n);
        }
      });
      return realPath;
    },
    handleClear() {
      this.checkedValue = [];
      this.$nextTick(() => {
        this.$emit('clear');
      });
    },
    removeValueTag(i) {
      this.checkedValue = this.checkedValue.filter((n, ni) => ni !== i);
    },
    handleCancel() {
      this.visible = false;
    },
    handleConfirm() {
      const { valueProp, labelProp, levelProp, title, limit, checkedNodePath } = this;
      if (checkedNodePath.length === 0) {
        return;
      }
      if (this.checkedValue.length >= limit) {
        return this.$message({
          type: 'warning',
          message: `最多选择${limit}个${title}`
        });
      }
      const valuePath = [];
      const labelPath = [];
      const levelPath = [];
      checkedNodePath.forEach((n) => {
        valuePath.push(n[valueProp]);
        labelPath.push(n[labelProp]);
        levelPath.push(n[levelProp]);
      });
      if (this.multiple) {
        if (this.checkedValue.find((n) => isEqual(n, valuePath))) {
          return this.$message({
            type: 'warning',
            message: `已选择该${title}`
          });
        }
      }
      const level = levelPath[levelPath.length - 1];
      const value = valuePath[valuePath.length - 1];
      const leafNode = checkedNodePath[checkedNodePath.length - 1];
      if (this.valueLevels.indexOf(level) < 0) {
        return this.$message({
          type: 'warning',
          message: `不能选择该级别${title}`
        });
      }
      if (this.disableValues.indexOf(value) > -1 || leafNode.disabled) {
        return this.$message({
          type: 'warning',
          message: `不能选择该${title}`
        });
      }
      if (this.multiple) {
        this.checkedValue = this.checkedValue.concat([valuePath]);
      } else {
        this.checkedValue = valuePath;
        this.visible = false;
      }
    }
  }
};
</script>
<style lang='less'>
.ee-cascader {
  &__inner {
    position: relative;
  }
  &__clear {
    margin-left: 14px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-weight: 400;
  }
  &.is-open {
    .el-input {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
  }
  &.has-value&.is-clearable {
    .ee-cascader {
      &__inner {
        &:hover {
          .el-input__suffix {
            display: none;
          }
          .clear-value {
            display: inline-block;
          }
        }
      }
    }
  }
  &.is-button-mode {
    align-items: center;
    .c-tag-item {
      margin: 4px 8px 4px 0;
    }
  }
  &.is-reverse {
    flex-direction: row-reverse;
    .ee-cascader {
      &__clear {
        margin: 0 14px 0 6px;
      }
    }
  }
  .el-input {
    width: auto;
    cursor: pointer;
    &__inner {
      cursor: pointer;
    }
    .el-icon-arrow-down {
      transition: all 0.3s;
    }
  }
  .clear-value {
    display: none;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    padding: 5px 0;
    width: 25px;
    background: #fff;
    text-align: center;
    color: #c0c4cc;
    cursor: pointer;
    z-index: 1;
    &:hover {
      display: inline-block;
    }
  }
  .value-list {
    padding-left: 14px;
  }
  .c-tag-item {
    margin: 6px 8px 2px 0;
  }
}
.is-ee-cascader {
  padding: 8px 24px 14px !important;

  &.isolate-root {
    #tab-1 {
      display: none;
    }
    #pane-1 {
      display: none !important;
    }
    #tab-2 {
      padding-left: 0;
      &::before {
        left: 0;
      }
    }
    .root-node {
      margin: 5px 0 0;
    }
  }

  .el-popover__title {
    display: none;
  }

  .tabs {
    margin-top: 8px;
    border-bottom: 1px solid #dcdfe6;
    &-item {
      position: relative;
      margin-right: 20px;
      padding: 6px 5px;
      color: #86909c;
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 5px;
        right: 5px;
        height: 2px;
      }
      &.is-active {
        color: #356df6;
        font-weight: 500;
        &::before {
          background: #356df6;
        }
      }
    }
    &-content {
      margin-top: 15px;
      min-height: 195px;
    }
  }

  .item {
    margin: 0 20px 10px 0;
    padding: 0 9px;
    height: 29px;
    box-sizing: border-box;
    line-height: 29px;
    border-radius: 4px;
    background: #fff;
    color: #1d2129;
    cursor: pointer;
    &:hover {
      background: #f4f4f4;
    }
    &.is-active {
      background: rgba(53, 109, 246, 0.1);
      color: #356df6;
    }
    &.is-selected {
      color: #356df6;
    }
    &.is-disabled {
      color: #909399 !important;
      background: #fff;
      &.is-active {
        background: #f4f4f4;
      }
    }
  }
  .nodata {
    padding-top: 96px;
    height: 64px;
    background: url('@/assets/icons/empty.svg') center no-repeat;
    background-size: 200px auto;
    color: #86909c;
    font-size: 14px;
    text-align: center;
  }
}
</style>
