<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 14:35:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-28 16:41:09
 * @FilePath: \company-template\src\views\system-manager\model-manager\components\ApplyDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="state === 'create'?'模型应用':'取消模型应用'"
    visible
    width="900px"
    :close-on-click-modal="false"
    custom-class="apply-dialog"
    :before-close="cancelOperation"
  >
    <div class="dialog-main">
      <div class="tips">将<span class="label-color">{{detail?.name}}</span>模型取消应用于所选择的监控点</div>
      <div class="operation-container">
        <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入监控点位置"/>
        <div class="select-tip">已选择<span class="label-color">{{selectedItemList.length}}</span>个</div>
      </div>
      <div class="table-container">
        <el-table
        :data="tableData"
        stripe
        border
        :row-key="getRowKey"
        @selection-change="changeSelection"
      >
        <el-table-column align="center" type="selection" width="60" :reserve-selection="true" />
        <el-table-column label="序号" type="index" width="80" :index="indexMethod" />
        <el-table-column label="监控点UUID" prop="monitorPointId" show-overflow-tooltip width="110" />
        <el-table-column label="监控点位置" prop="monitorPointName" show-overflow-tooltip min-width="120" />
        <el-table-column label="经度" prop="longitude" show-overflow-tooltip width="120" />
        <el-table-column label="纬度" prop="latitude" show-overflow-tooltip width="120" />
        <el-table-column label="配置模型数量" prop="modelNum" width="120" >
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.modelNum > 0"
              placement="right"
              width="350"
              :visible-arrow="false"
              popper-class="model-popover"
              :ref="'popover-' + scope.row.id"
            >
              <div class="model-popover-title border-white-border border-b">模型({{scope.row.modelNum}})
                <i class="el-icon-close" @click="closePopover(scope.row.id)"></i>
              </div>
              <div class="w-full pl-4 pr-4 mt-2" style="max-height: 368px;overflow: auto;">
                <div v-for="item of modelList" :key="item.id" class="model-popover-item">
                  <svg-icon class-name="mini-model-icon" icon-class="mini-model"/>
                  <el-tooltip class="item" effect="dark" :content="item.modelNameCh" placement="top" :disabled="item.modelNameCh.length <= 20">
                    <span class="model-detail text-hidden">{{item.modelNameCh}}</span>
                  </el-tooltip>
                </div>
              </div>
              <div slot="reference" class="label-color" @click="getDeviceList(scope.row)">{{scope.row.modelNum}}</div>
            </el-popover>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <el-pagination
        v-show="tableListTotal > 0"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="tableListTotal"
        @size-change="changeSize"
        @current-change="changePage">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">取消</el-button>
      <el-button class="primary" :disabled="selectedItemList.length === 0" @click="saveOperation">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce.js';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import { getDialogDeviceListData, getModelListData } from '@/api/model-manage';

export default {
  props: {
    state: {
      type: String,
      default: 'create',
      required: true
    },
    detail: {
      type: Object,
      required: true
    }
  },
  components: {
    TableOperationSearchInput
  },
  data() {
    return {
      searchWord: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableListTotal: 0,
      modelList: [],
      selectedItemList: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 序号排序
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    changeSelection(selectedList) {
      this.selectedItemList = selectedList;
    },
    // 每页选择
    changeSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData();
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 搜索
    searchTable() {
      this.changePage(1);
    },
    // 获取表格数据
    getTableData() {
      const params = {
        keyword: this.searchWord,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        modelId: this.detail.id,
        config: this.state === 'create' ? 'UN_CONFIGURED' : 'CONFIGURED' // 应用(create) 查未配置的数据, 取消应用(edit) 查配置的数据
      };
      getDialogDeviceListData(params).then((result) => {
        this.tableData = result.data.records;
        this.tableListTotal = result.data.total;
      }).catch((err) => {
      });
    },
    // 获取应用关联模型数
    getDeviceList(row) {
      if (!this.$refs[`popover-${row.id}`].showPopper) {
        const params = {
          deviceId: row.id,
          pageSize: row.modelNum,
          pageNum: 1,
          config: this.state === 'create' ? 'UN_CONFIGURED' : 'CONFIGURED' // 应用(create) 查未配置的数据, 取消应用(edit) 查配置的数据
        };
        getModelListData(params).then((result) => {
          this.modelList = result.data.records;
        }).catch((err) => {
        });
      }
    },
    closePopover(id) {
      this.$refs[`popover-${id}`].doClose();
    },
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveOperation: _debounce(function () {
      this.$emit('save', this.selectedItemList);
    }, 300)
  }
};
</script>
<style lang="less" scoped>
.apply-dialog {
  .operation-container {
    height: 40px;
    line-height: 40px;
    margin: 12px 0;
    .select-tip {
      float: right;
    }
  }
  .el-pagination {
    text-align: center;
    padding: 12px 0;
  }
  .el-popover__reference {
    cursor: pointer;
  }
}
</style>
<style lang="less">
.model-popover {
  padding: 0px;
  overflow: auto;
  .model-popover-title {
    padding: 8px 10px 6px;
    .el-icon-close {
      float: right;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
  }
  .model-popover-item {
    margin-bottom: 8px;
    & + .model-popover-item {
      margin-top: 8px;
    }
    .svg-icon {
      margin-right: 8px;
      float: left;
      position: relative;
      top: 2px;
    }
    .model-detail {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      max-width: calc(100% - 32px);
    }
  }
}
</style>
