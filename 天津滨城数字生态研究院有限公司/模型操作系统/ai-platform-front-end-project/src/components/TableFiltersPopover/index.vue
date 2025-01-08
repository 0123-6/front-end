<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 09:50:29
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-22 17:22:11
 * @FilePath: \ai-platform-front-end-project\src\components\TableFiltersPopover\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <span>{{ tableLabel.label }}</span>
    <el-popover v-model="visible" placement="bottom" :popper-class="'table-filters-popover'" trigger="click" :width="popoverWidth">
      <div class="table-filters-popover-content">
        <el-checkbox-group v-if="selectionList.length !== 0" v-model="selectedList" @change="changeSelectedList">
          <el-checkbox v-for="item of selectionList" :key="item[keyProps.code]" :label="item[keyProps.code]">
            {{ item[keyProps.label] }}
          </el-checkbox>
        </el-checkbox-group>
        <div v-else class="empty-container">暂无数据</div>
        <div class="table-filters-popover-buttons">
          <el-button size="mini" type="text" :disabled="selectedList.length === 0" @click="resetTableFilters">重置
          </el-button>
          <el-button size="mini" type="primary" @click="changeTableFilters">确定</el-button>
        </div>
      </div>
      <svg-icon
        slot="reference"
        :class-name="visible || selectedList.length > 0 ? 'table-filters-active-icon' : 'table-filters-icon'"
        :icon-class="visible || selectedList.length > 0 ? 'table-filters-active' : 'table-filters'"
      />
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    tableLabel: {
      type: Object,
      default: () => {
        return {
          type: 'status',
          label: '状态'
        };
      },
      required: true
    },
    selectionList: {
      type: Array,
      default: () => {
        return [];
      },
      required: true
    },
    keyProps: {
      type: Object,
      default: () => {
        return {
          'code': 'code',
          'label': 'label'
        };
      }
    },
    popoverWidth: {
      type: [Number, String],
      default: '140'
    }
  },
  data() {
    return {
      selectedList: [],
      visible: false,
      isChangeSelected: false // 判断勾选是不是有变化，有变化才发请求，减少请求次数
    };
  },
  watch: {
    visible: function(value) {
      if (!value && this.isChangeSelected) {
        this.$emit('filter', this.tableLabel.type, this.selectedList);
      }
      if (value) {
        this.isChangeSelected = false;
      }
    }
  },
  methods: {
    resetTableFilters() {
      this.isChangeSelected = true;
      this.selectedList = [];
      this.$emit('reset', this.tableLabel.type, this.selectedList);
    },
    changeTableFilters() {
      this.isChangeSelected = true;
      this.visible = false;
    },
    changeSelectedList() {
      this.isChangeSelected = true;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-popover__reference-wrapper {
    padding: 2px !important;
    cursor: pointer !important;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    position: relative;
    top: 2px;
    left: 2px;

    &:hover {
      background: #E6EBEF !important;
    }
  }
}
.table-filters-popover-buttons{
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-container {
  text-align: center;
  padding: 16px 0;
  color: #B7B7B7;
}
</style>
