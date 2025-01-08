<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-14 14:03:19
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 17:17:36
 * @FilePath: \intelligent-search-system-web\src\views\system-manager\device-manager\detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="device-detail-container">
    <div class="device-detail-header">
      <label>查看</label>
      <div class="buttons-container">
        <el-button class="back" type="text" @click="goBack" icon="el-icon-caret-left">返回</el-button>
      </div>
    </div>
    <div class="device-detail-main">
      <el-descriptions title="基本信息" :column="4">
        <el-descriptions-item label="监控点UUID">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.monitorPointId"
                      :disabled="deviceDetail?.monitorPointId.length <= 7"
                      placement="top">
            <span>{{deviceDetail?.monitorPointId}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="监控点名称">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.monitorPointName"
                      :disabled="deviceDetail?.monitorPointName.length <= 8"
                      placement="top">
            <span>{{deviceDetail?.monitorPointName}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="监控点状态" :contentClassName="{'online': deviceDetail?.status === 0}">
          {{deviceStatus[deviceDetail.status]}}
          <el-button size="small" class="primary plain" :disabled="deviceDetail?.status !== 2" @click="openVideoDialog">查看视频流</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.createTime"
                      placement="top">
            <span>{{deviceDetail?.createTime}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="经度">{{deviceDetail?.longitude}}</el-descriptions-item>
        <el-descriptions-item label="纬度">{{deviceDetail?.latitude}}</el-descriptions-item>
        <el-descriptions-item label="位置类型">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.locationItem?.itemText"
                      :disabled="deviceDetail?.locationItem?.itemText.length <= 9"
                      placement="top">
            <span>{{deviceDetail?.locationItem?.itemText}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="朝向">{{deviceDetail?.orientationItem?.itemText}}</el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.deviceTypeItem?.itemText"
                      :disabled="deviceDetail?.deviceTypeItem?.itemText.length <= 11"
                      placement="top">
            <span>{{deviceDetail?.deviceTypeItem?.itemText}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="品牌">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.brand"
                      :disabled="deviceDetail?.brand.length <= 11"
                      placement="top">
            <span>{{deviceDetail?.brand}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="行政区划代码">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.divisonCode"
                      :disabled="deviceDetail?.divisonCode.length <= 7"
                      placement="top">
            <span>{{deviceDetail?.divisonCode}}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="单位名称">
          <el-tooltip effect="dark"
                      :content="deviceDetail?.company"
                      :disabled="deviceDetail?.company.length <= 9"
                      placement="top">
            <span>{{deviceDetail?.company}}</span>
          </el-tooltip>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="device-detail-footer">
      <div class="model-header">
        <label>已配模型</label>
      </div>
      <div class="model-container">
        <div class="operation-container">
          <TableOperationSearchInput :searchWord.sync="searchWord" @search="searchTable" placeholder="请输入模型名称"/>
          <div class="buttons-container">
            <el-button class="primary" @click="openBatchUnConfigureDialog" :disabled="isCanUnConfigure">批量取消配置</el-button>
            <el-button class="primary plain" @click="openBatchDeleteDialog" :disabled="isCanDelete">批量删除</el-button>
          </div>
        </div>
        <div class="table-container" id="table">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            stripe
            border
            :row-key="getRowKey"
            @selection-change="changeSelection"
          >
            <el-table-column align="center" type="selection" width="40" :reserve-selection="true" />
            <el-table-column label="序号" type="index" width="50" :index="indexMethod" show-overflow-tooltip/>
            <el-table-column label="ID" prop="id" width="50" show-overflow-tooltip/>
            <el-table-column label="模型名称" prop="modelNameCh" show-overflow-tooltip min-width="130">
              <template slot-scope="scope">
                <span class="hover:cursor-pointer hover:text-blue" @click="toModelDetail(scope.row)">{{scope.row.modelNameCh}}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" prop="modelTypeName" show-overflow-tooltip min-width="80" />
            <el-table-column label="版本" prop="versionName" show-overflow-tooltip width="50" />
            <el-table-column label="配置时间" prop="configuredTime" show-overflow-tooltip min-width="60"/>
            <el-table-column label="服务开始时间" prop="sysUserModelData.expiryTimeStart" show-overflow-tooltip min-width="60" />
            <el-table-column label="服务结束时间" prop="sysUserModelData.expiryTimeEnd" show-overflow-tooltip min-width="60"/>
            <el-table-column label="状态" prop="expire" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span :class="[scope.row.expire === 2?'online':'offline', 'dot']"></span>
                {{scope.row.expire === 2? '服务中':'已过期'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope" >
                <TableOperationTooltip
                  icon-class="table-cancel-config"
                  tooltip-title="取消配置"
                  :iconDisabled="scope.row.expire === 1"
                  @tooltipClick="openUnConfigureDialog(scope.row)"
                />
                <TableOperationTooltip
                  icon-class="table-delete"
                  tooltip-title="删除"
                  :iconDisabled="scope.row.expire === 2"
                  @tooltipClick="openDeleteDialog(scope.row)"
                />
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
    <el-dialog
      v-if="dialogVideoVisible"
      v-dialog-drag
      title="详细信息"
      :visible.sync="dialogVideoVisible"
      @close="closeVideo">
      <div slot="footer">
        <hls-video ref="video" v-if="url" :src="url" style="width: 100%;height: 100%;"></hls-video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MessageDialog from '@/components/MessageDialog';
import TableOperationSearchInput from '@/views/system-manager/components/TableOperationSearchInput';
import TableOperationTooltip from '@/views/system-manager/components/TableOperationTooltip';
import {
  cancelModelDevice, getDeviceInfo, getDeviceStream, getModelListData
} from '@/api/device-manage';
import { deviceStatusDict } from '@/views/system-manager/device-manager/deviceDict';
import HlsVideo from '@/components/HlsVideo';

export default {
  name: 'device-detail',
  components: {
    MessageDialog,
    TableOperationSearchInput,
    TableOperationTooltip,
    HlsVideo
  },
  data() {
    return {
      deviceDetail: {
        id: ''
      },
      searchWord: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableListTotal: 0,
      deviceStatus: deviceStatusDict,
      selectedItemList: [],
      messageDialogVisible: false, // 信息提示框显隐
      messageType: '', // 信息提示框类型
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      isCanUnConfigure: true,
      isCanDelete: true,
      dialogVideoVisible: false,
      player: '',
      url: '',
      loading: false // 加载中
    };
  },
  mounted() {
    this.deviceDetail.id = this.$route.params.id;
    this.getDeviceDetail();
    this.getTableData();
  },
  destroyVideos() {
    if (!this.player) return;
    this.player.pause();
    this.player.unload();
    this.player.detachMediaElement();
    this.player.destroy();
    this.player = null;
  },
  methods: {
    goBack() {
      this.$router.push('/system/device');
    },
    getDeviceDetail() {
      getDeviceInfo({ id: this.deviceDetail.id }).then((res) => {
        if (res.code === '000000') {
          this.deviceDetail = res.data;
        }
      });
    },
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
      if (selectedList.length !== 0) {
        this.isCanUnConfigure = !this.selectedItemList.every((item) => item.expire === 2);
        this.isCanDelete = !this.selectedItemList.every((item) => item.expire === 1);
      } else {
        this.isCanUnConfigure = true;
        this.isCanDelete = true;
      }
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
      this.loading = true;
      const params = {
        config: 'CONFIGURED',
        deviceId: this.deviceDetail.id,
        keyword: this.searchWord,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      getModelListData(params).then((res) => {
        this.tableData = res.data.records;
        this.tableListTotal = res.data.total;
        if (
          this.tableListTotal > 0 && res.data.records.length === 0 && this.currentPage > 1
        ) {
          this.currentPage -= 1;
          this.getTableData();
        }
        // 样式复位
        document.getElementById('table').scrollTop = 0;
        this.loading = false;
      });
    },
    // 打开取消配置提示框
    openUnConfigureDialog(row) {
      if (row.expire === 1) return;
      this.selectedItemList = [row];
      this.messageType = 'unConfigure';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = `确定要取消配置<span class="label-color">&nbsp;&nbsp;${row.modelNameCh}&nbsp;&nbsp;</span>吗?`;
    },
    // 打开批量取消配置提示框
    openBatchUnConfigureDialog() {
      this.messageType = 'unConfigure';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = '确定要批量取消配置吗?';
    },
    // 打开删除提示框
    openDeleteDialog(row) {
      if (row.expire === 2) return;
      this.selectedItemList = [row];
      this.messageType = 'delete';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = `确定要删除配置<span class="label-color">&nbsp;&nbsp;${row.modelNameCh}&nbsp;&nbsp;</span>吗?`;
    },
    // 打开批量删除提示框
    openBatchDeleteDialog() {
      this.messageType = 'delete';
      this.messageDialogVisible = true;
      this.messageTitle = '提示';
      this.messageContent = '确定要批量删除配置吗?';
    },
    // 取消取消配置提示框
    cancelMessage() {
      this.messageDialogVisible = false;
    },
    // 保存取消配置提示框
    saveMessage() {
      const params = {
        deviceIds: [this.deviceDetail.id],
        modelIds: this.selectedItemList.map((item) => item.id)
      };
      cancelModelDevice(params).then((res) => {
        if (res.code === '000000') {
          if (this.messageType === 'unConfigure') {
            this.$message({
              type: 'success',
              message: '取消配置模型关联成功'
            });
          } else {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          }
          this.cancelMessage();
          this.getTableData();

          this.selectedItemList = [];
          this.$refs.multipleTable.clearSelection();
          this.isCanDelete = true;
          this.isCanUnConfigure = true;
        }
      });
    },
    // 打开视频流弹框
    openVideoDialog() {
      getDeviceStream({ monitorPointId: this.deviceDetail.monitorPointId }).then((res) => {
        if (res.code === '000000') {
          // http://10.32.1.1:83/openUrl/DzNPn9v/live.m3u8
          const url = res.data.preview_url.toString();
          const arrUrl = url.split('//')[1].split('/');
          arrUrl.shift();
          const path = arrUrl.join('/');
          this.url = `${window.location.origin}/py-video/${path}`;
          this.dialogVideoVisible = true;
        }
      });
    },
    closeVideo() {
      this.$refs.video.closeVideo();
      this.dialogVideoVisible = false;
    },
    // 点击模型名称
    toModelDetail(row) {
      const params = {
        buttonVisible: false
      };
      sessionStorage.setItem('modelApplyButtonParams', JSON.stringify(params));
      const routeData = this.$router.resolve({
        path: `/library/detail/${row.id}`
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.device-detail-container {
  background-color: #FFFFFF;
  padding: 12px 24px;
  min-height: 100%;
  border-radius: 4px;
  box-shadow: 0 9px 15px 0 #E5ECF1;
  .device-detail-header {
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    label {
      font-size: 16px;
      color: @text-primary-dark;
      font-weight: 600;
    }
    .buttons-container {
      float: right;
    }
  }
  .device-detail-main {
    .el-button {
      &.primary {
        margin-left: 8px;
        padding: 4px !important;
      }
    }
    ::v-deep .online {
      color: @success-color;
    }
  }
  .device-detail-footer {
    margin-top: 16px;
    border: 1px solid rgba(236,238,245,1);
    //padding-bottom: 32px;
    //min-height: calc(100% - 280px);
    .model-header {
      padding: 8px 16px;
      border-bottom: 1px solid rgba(236,238,245,1);
      label {
        font-size: 14px;
        color: @text-lighter;
        font-weight: 700;
      }
    }
    .model-container {
      padding: 16px 16px 32px;
      min-height: calc(100% - 10px);
      .operation-container {
        height: 40px;
        line-height: 40px;
        margin-bottom: 12px;
        .buttons-container {
          float: right;
        }
      }
      .table-container {
        overflow: auto;
        .dot {
          height: 12px;
          width: 12px;
          display: inline-block;
          border-radius: 12px;
          position: relative;
          top: 1px;
          &.online {
            background-color: #00AB5A;
          }
          &.offline {
            background-color: #C0C4C2;
          }
        }
        }
      .el-pagination {
        text-align: center;
        margin-top: 12px;
      }
    }
  }
}
::v-deep {
  .el-descriptions {
    border: 1px solid rgba(236,238,245,1);
    .el-descriptions__header {
      margin-bottom: 0;
      border-bottom: 1px solid #eceef5;
      padding: 8px 16px;
    }
    .el-descriptions__body {
      tbody {
        /* 奇数行 */
        &:nth-of-type(odd){
          background: #F9FAFA;
        }
        /* 偶数行 */
        &:nth-of-type(even){
          background: #FFFFFF;
        }
      }
      .el-descriptions-item__cell {
        padding: 16px;
        .el-descriptions-item__content {
          .ellipsis-muti-line(1);
        }
      }
    }
  }
  .el-descriptions__title {
    font-size: 14px;
  }
}
</style>
