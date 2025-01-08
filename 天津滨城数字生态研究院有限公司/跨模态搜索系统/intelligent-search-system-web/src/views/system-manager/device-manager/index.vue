<!--rdList
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-11 09:59:52
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-11 10:57:38
 * @FilePath: \company-template\src\views\system-manager\device-manager\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="device-manager-container">
    <div class="device-header">
      <label>监控点管理</label>
      <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入监控点位置/UUID"/>
      <div class="buttons-container">
        <el-button class="primary" @click="openDetailDialog('create')">添加监控点</el-button>
        <el-button class="primary plain">批量导入</el-button>
        <el-button class="primary plain" @click="openBatchDeleteDialog" :disabled="selectedMonitorList.length === 0">批量删除</el-button>
      </div>
    </div>
    <div class="device-main">
      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          ref="multipleTable"
          :data="tableData"
          stripe
          border
          :row-key="getRowKey"
          @selection-change="changeSelection"
        >
          <template slot="empty">{{tableEmptyText}}</template>
          <el-table-column align="center" type="selection" width="40" :reserve-selection="true" />
          <el-table-column label="序号" type="index" width="50" min-width="50" :index="indexMethod" />
          <el-table-column label="监控点UUID" prop="monitorPointId" show-overflow-tooltip min-width="90" />
          <el-table-column label="监控点位置" prop="monitorPointName" show-overflow-tooltip min-width="100" />
          <el-table-column label="监控点状态" prop="status" show-overflow-tooltip width="100">
            <template slot-scope="scope" >
            <span :class="[scope.row.status === 0?'online':'offline']">
              {{deviceStatus[scope.row.status]}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="已配模型" prop="modelNum" show-overflow-tooltip width="80">
            <template slot-scope="scope" >
              {{scope.row.modelNum || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="170" />
          <el-table-column label="操作" width="160">
            <template slot-scope="scope" >
              <TableOperationTooltip icon-class="table-watch" tooltip-title="查看" @tooltipClick="toDeviceDetail(scope.row)" />
              <TableOperationTooltip icon-class="table-edit" tooltip-title="编辑" @tooltipClick="openDetailDialog('edit', scope.row)" />
              <TableOperationTooltip icon-class="table-config" tooltip-title="配置" @tooltipClick="openConfigDialog('create', scope.row)" />
              <TableOperationTooltip icon-class="table-cancel-config" tooltip-title="取消配置" @tooltipClick="openConfigDialog('edit',scope.row)" />
              <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" @tooltipClick="openDeleteDialog(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pb-4"
        v-show="tableListTotal > 10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="tableListTotal"
        @size-change="changeSize"
        @current-change="changePage">
      </el-pagination>
    </div>
    <MessageDialog
      v-if="messageDialogVisible"
      :title="messageTitle"
      @save="saveMessage"
      @cancel="cancelMessage"
    >
      <template slot="content">
        <div class="content-container" v-html="messageContent" />
      </template>
    </MessageDialog>
    <DetailDialog
      v-if="detailDialogVisible"
      :state="detailDialogState"
      :detail-form.sync="editDeviceDetail"
      @save="saveDetail"
      @cancel="cancelDetail"
    />
    <ConfigDialog
      v-if="configDialogVisible"
      :state="configDialogState"
      :detail="configDialogDetail"
      @save="saveConfig"
      @cancel="cancelConfig"
    />
  </div>
</template>

<script>
import MessageDialog from '@/components/MessageDialog';
import DetailDialog from '@/views/system-manager/device-manager/components/DetailDialog';
import ConfigDialog from '@/views/system-manager/device-manager/components/ConfigDialog';
import TableOperationTooltip from '@/views/system-manager/components/TableOperationTooltip';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import {
  addDevice, addModelDevice, cancelModelDevice, deleteDevice, editDevice, getDeviceListData
} from '@/api/device-manage';
import { deviceStatusDict } from '@/views/system-manager/device-manager/deviceDict';

export default {
  name: 'device-manger',
  components: {
    MessageDialog,
    DetailDialog,
    ConfigDialog,
    TableOperationTooltip,
    TableOperationSearchInput
  },
  data() {
    return {
      searchWord: '',
      tableEmptyText: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableListTotal: 0,
      deviceStatus: deviceStatusDict,
      selectedItem: null, // 选中的单独一项
      selectedItemList: [],
      selectedMonitorList: [], // 选中的监控点列表
      messageDialogVisible: false, // 信息提示框显隐
      messageType: '', // 信息提示框类型
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      detailDialogVisible: false, // 详情弹框显隐
      detailDialogState: 'create', // 详情弹框状态
      editDeviceDetail: {}, //  详情弹框数据
      configDialogVisible: false, // 配置弹框显隐
      configDialogState: 'create', // 配置弹框状态
      configDialogDetail: {},
      tableLoading: false
    };
  },
  mounted() {
    this.tableLoading = true;
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
      this.selectedMonitorList = selectedList;
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
        pageNum: this.currentPage
      };
      this.tableEmptyText = '';
      getDeviceListData(params).then((res) => {
        if (res.code === '000000') {
          this.tableData = res.data.records;
          this.tableListTotal = res.data.total;
          if (
            this.tableListTotal > 0 && res.data.records.length === 0 && this.currentPage > 1
          ) {
            this.currentPage -= 1;
            this.getTableData();
          }
          if (this.tableData.length === 0) this.tableEmptyText = '暂无数据';
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      }).catch((err) => {
        this.tableLoading = false;
      });
    },
    // 打开删除提示框
    openDeleteDialog(row) {
      this.messageType = 'deleteOne';
      this.messageDialogVisible = true;
      this.selectedItem = row;
      this.messageTitle = '提示';
      this.messageContent = `确定要删除监控点<span class="label-color">&nbsp;&nbsp;${row.monitorPointId}&nbsp;&nbsp;</span>吗?`;
    },
    // 打开批量删除提示框
    openBatchDeleteDialog() {
      this.messageType = 'delete';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = '确定要批量删除监控点吗?';
    },
    openBatchInputDialog() {
      this.messageType = 'input';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = '确定要批量导入监控点吗?';
    },
    // 取消信息提示框
    cancelMessage() {
      if (this.selectedItem !== null) {
        this.selectedItem = null;
      }
      this.messageDialogVisible = false;
    },
    // 保存信息提示框
    saveMessage() {
      if (this.messageType === 'config') {
        const params = {
          deviceIds: [this.configDialogDetail.id],
          modelIds: this.selectedItemList
        };
        addModelDevice(params).then((res) => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '配置模型关联成功'
            });
            this.cancelConfig();
          }
        });
      }
      if (this.messageType === 'cancelConfig') {
        const params = {
          deviceIds: [this.configDialogDetail.id],
          modelIds: this.selectedItemList
        };
        cancelModelDevice(params).then((res) => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '取消配置模型关联成功'
            });
            this.cancelConfig();
          }
        });
      }
      if (this.messageType === 'input') {
        //
      }
      if (this.messageType === 'delete') {
        const ids = this.selectedMonitorList.map((item) => item.id);
        deleteDevice(ids).then((res) => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '删除设备成功'
            });
            this.getTableData();
          }
        });
      }
      // 删除一项
      if (this.messageType === 'deleteOne') {
        console.log('into deleteOne');
        console.log(this.selectedItem);
        const ids = [this.selectedItem.id];
        deleteDevice(ids).then((res) => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '删除设备成功'
            });
            this.getTableData();
          }
        });
      }
      this.$refs.multipleTable.clearSelection();
      this.getTableData();
      this.cancelMessage();
    },
    // 打开详情弹框
    openDetailDialog(type, row) {
      this.detailDialogState = type;
      if (type === 'create') {
        this.editDeviceDetail = {};
      } else {
        this.editDeviceDetail = row;
      }
      this.detailDialogVisible = true;
    },
    // 取消详情弹框
    cancelDetail() {
      this.detailDialogVisible = false;
    },
    // 保存详情弹框
    saveDetail() {
      if (this.detailDialogState === 'create') {
        addDevice(this.editDeviceDetail).then((res) => {
          if (res.code === '000000') {
            this.searchTable();
          }
        });
      }
      if (this.detailDialogState === 'edit') {
        editDevice(this.editDeviceDetail).then((res) => {
          if (res.code === '000000') {
            this.getTableData();
          }
        });
      }
      this.cancelDetail();
    },
    // 打开配置弹框
    openConfigDialog(type, row) {
      this.configDialogState = type;
      this.configDialogVisible = true;
      this.configDialogDetail = row;
    },
    // 取消配置弹框
    cancelConfig() {
      this.configDialogVisible = false;
    },
    // 保存配置弹框
    saveConfig(list) {
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.selectedItemList = list;
      if (this.configDialogState === 'create') {
        this.messageType = 'config';
        this.messageContent = `确定要配置<span class="label-color">&nbsp;&nbsp;${list.length}&nbsp;&nbsp;</span>个模型吗?`;
      } else {
        this.messageType = 'cancelConfig';
        this.messageContent = `确定要取消配置<span class="label-color">&nbsp;&nbsp;${list.length}&nbsp;&nbsp;</span>个模型吗?`;
      }
    },
    // 查看详情
    toDeviceDetail(row) {
      this.$router.push(`/system/device-detail/${row.id}`);
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.device-manager-container {
  background-color: #FFFFFF;
  padding: 12px 24px;
  min-height: 100%;
  border-radius: 4px;
  box-shadow: 0 9px 15px 0 #E5ECF1;

  .device-header {
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    label {
      font-size: 16px;
      color: @text-primary-dark;
      font-weight: 600;
    }
    ::v-deep .search-input {
      margin-left: 100px;
    }
    .buttons-container {
      float: right;
    }
  }
  .device-main {
    text-align: center;
    height: calc(100% - 40px);
    .table-container {
      overflow: auto;
    }
    .online {
      color: @success-color;
    }
    .el-pagination {
      margin-top: 12px;
      margin-bottom: 48px;
    }
  }
}
</style>
