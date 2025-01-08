<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-30 10:57:58
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-08 14:04:23
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\detail\mine\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="mine-dataSet-container">
    <div class="title-container">
      <div class="title-content">
        <span>{{ dataSetDetail.id }}-{{ dataSetDetail.name }}</span>
        <svg-icon
          :class-name="isEditing?'dataset-edit-active-icon':'dataset-edit-icon'"
          :icon-class="isEditing?'dataset-edit-active':'dataset-edit'"
          @click="openEditDialog"
        />
      </div>
      <div class="buttons-container">
        <div v-show="isShowImportTip" class="import-history-container" :class="importTipType">
          <i class="el-icon-info" />
          <div
            class="import-detail-container"
          >
            <div
              ref="songName"
              class="import-tip-container"
              :class="{ scroll: nameScroll }"
            >
              {{ importTip }}
            </div>
          </div>
          <i class="el-icon-close" @click="cancelImportTip" />
        </div>
        <el-button v-if="!isIframeInSettings" class="blue-btn" :disabled="importTipType === 'loading'" @click="setOperation">设置</el-button>
        <el-button v-if="!isIframeInSettings" class="blue-btn" @click="openUploadDialog">导入</el-button>
        <!-- <el-button v-if="!isIframeInSettings" class="blue-btn" @click="setOperation">导出</el-button> -->
        <el-button icon="el-icon-caret-left" class="card-back-button" @click="backCard">返回</el-button>
      </div>
    </div>
    <iframe id="lsIframe" :src="iframeUrl" frameborder="0" height="100%" width="100%" />
    <DetailDialog
      v-if="isShowDetailDialog"
      ref="detailDialogEL"
      :state="detailDialogState"
      :detail-form.sync="editDataSetDetail"
      @save="saveDataSet"
      @cancel="cancelSave"
    />
    <UploadDialog
      v-if="isShowUploadDialog"
      ref="detailDialogEL"
      :data-set-id="dataSetDetail.labelStudioProjectId"
      :data-set-type="dataSetDetail.type"
      @save="saveUploadLabels"
      @cancel="cancelSaveUploadLabels"
    />
    <MessageDialog
      v-if="isShowMessageDialog"
      title="提示"
      :is-show-footer="false"
      :is-show-close-button="messageType !== 'loading'"
      @cancel="cancelMessage"
    >
      <template slot="content">
        <div class="content-container">
          <template v-if="messageType === 'loading' || messageType === 'hasLabeledSuccess'">
            <svg-icon
              class-name="loading-icon"
              icon-class="loading"
            />
            <div class="label-color">导入中</div>
          </template>
          <template v-else-if="messageType === 'notLabeledSuccess'">
            <svg-icon
              class-name="success-icon"
              icon-class="success"
            />
            <div class="success-color">导入成功</div>
          </template>
          <template v-else-if="messageType === 'error'">
            <svg-icon
              class-name="error-icon"
              icon-class="error"
            />
            <div class="error-color">导入失败</div>
            <div class="error-color">{{ errorMessage }}</div>
          </template>
        </div>
      </template>
    </MessageDialog>
  </div>
</template>
<script>
import DetailDialog from '@/views/data-manager/dataSet/components/DetailDialog';
import UploadDialog from '@/views/data-manager/dataSet/components/UploadDialog';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import { getDataSetEditDetail, updateDataSet } from '@/api/data-set';
import { reimportFile, submitFile, importFromDataset, getLabelDatasetDetail, changeImportHistory } from '@/api/label-studio';

import { mapGetters } from 'vuex';
export default {
  components: {
    DetailDialog,
    UploadDialog,
    MessageDialog
  },
  data() {
    return {
      iframeUrl: '',
      dataSetDetail: {}, //  详情弹数据
      editDataSetDetail: {},
      isShowDetailDialog: false, // 详情弹框显隐
      detailDialogState: 'edit', // 详情弹框状态
      isEditing: false,
      isIframeInSettings: false,
      isIframeLabelDetail: false,
      isShowUploadDialog: false,
      isShowMessageDialog: false,
      messageType: 'loading',
      errorMessage: '具体的失败原因',
      importTip: '',
      importTipType: '',
      importHistory: null,
      isShowImportTip: false,
      nameScroll: false
    };
  },
  computed: {
    ...mapGetters(['labelStudioUrl', 'operationPermissionsList'])
    // ...mapGetters(['operationPermissionsList']),
    // labelStudioUrl() {
    //   return 'http://localhost:8086';
    // }
  },
  mounted() {
    this.getDataSetDetail();
    const iframe = document.querySelector('#lsIframe');
    const permissionsObj = {};
    if (this.operationPermissionsList.indexOf('dataSetExport') >= 0) {
      permissionsObj.isShowExport = true;
    } else {
      permissionsObj.isShowExport = false;
    }
    if (this.operationPermissionsList.indexOf('dataSetLabel') >= 0) {
      permissionsObj.isShowSource = true;
    } else {
      permissionsObj.isShowSource = false;
    }
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function() {
        // iframe加载完毕以后执行操作
        const receiver = document.getElementById('lsIframe').contentWindow;
        receiver.postMessage(JSON.stringify(permissionsObj), '*');
      });
    } else {
      iframe.onload = function() {
        // iframe加载完毕以后执行操作
        const receiver = document.getElementById('lsIframe').contentWindow;
        receiver.postMessage(JSON.stringify(permissionsObj), '*');
      };
    }

    window.addEventListener('message', e => {
      if (e.origin) {
        const labelStudioMessage = JSON.parse(e.data);
        if (labelStudioMessage.tableClick === 'labelDetail') {
          this.isIframeLabelDetail = true;
        }
        if (labelStudioMessage.backList === true) {
          this.isIframeInSettings = false;
          this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}`;
          setTimeout(() => {
            this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/data?token=d080a2576954dd32d250b2a94380d20292c67322`;
          }, 0);
        }
      }
    }, false);
  },
  methods: {
    getLabelDatasetDetail() {
      this.importTip = '';
      this.importTipType = '';
      this.importHistory = null;
      getLabelDatasetDetail(this.dataSetDetail.labelStudioProjectId).then((res) => {
        if (res) {
          if (res.import_history) {
            this.importHistory = res.import_history;
            if (this.importHistory.import_type === 'IMPORT') {
              if (this.importHistory.status === 1) {
                this.importTip = '数据集正在导入';
                this.importTipType = 'loading';
              } else if (this.importHistory.status === 2) {
                this.importTip = '数据集导入成功';
                this.importTipType = 'success';
                setTimeout(() => {
                  this.cancelImportTip();
                }, 3000);
              } else if (this.importHistory.status === 4) {
                this.importTip = '数据集导入失败;失败原因' + this.importHistory.description;
                this.importTipType = 'error';
              }
            } else if (this.importHistory.import_type === 'FORK') {
              if (this.importHistory.status === 1) {
                this.importTip = '数据集正在Fork';
                this.importTipType = 'loading';
              } else if (this.importHistory.status === 2) {
                this.importTip = '数据集Fork成功';
                this.importTipType = 'success';
                setTimeout(() => {
                  this.cancelImportTip();
                }, 3000);
              } else if (this.importHistory.status === 4) {
                this.importTip = '数据集Fork失败;失败原因' + this.importHistory.description;
                this.importTipType = 'error';
              }
            } else if (this.importHistory.import_type === 'CHECK_FORK') {
              if (this.importHistory.status === 1) {
                this.importTip = '审核通过，数据集发布中';
                this.importTipType = 'loading';
              } else if (this.importHistory.status === 2) {
                this.importTip = '审核通过，数据集发布成功';
                this.importTipType = 'success';
                setTimeout(() => {
                  this.cancelImportTip();
                }, 3000);
              } else if (this.importHistory.status === 4) {
                this.importTip = '审核通过，数据集发布失败;失败原因' + this.importHistory.description;
                this.importTipType = 'error';
              }
            }
            if (this.importHistory.status !== 3) {
              this.isShowImportTip = true;
              setTimeout(() => {
                if (this.$refs.songName.clientWidth > 180) {
                  this.nameScroll = true;
                } else {
                  this.nameScroll = false;
                }
              }, 300);
            }
          }
        }
      });
    },
    // 获取详情
    getDataSetDetail() {
      getDataSetEditDetail(this.$route.params.id).then(res => {
        if (res.code === '000000') {
          this.dataSetDetail = res.data;
          // this.dataSetDetail.labelStudioProjectId = '380';
          this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/data?token=d080a2576954dd32d250b2a94380d20292c67322`;
          this.getLabelDatasetDetail();
        }
      });
    },
    // 打开编辑提示框
    openEditDialog() {
      const { id, name, type, description, labelStudioProjectId } = this.dataSetDetail;
      this.editDataSetDetail = { id, name, type, description, labelStudioProjectId };
      this.isShowDetailDialog = true;
      this.isEditing = true;
    },
    // 保存数据集
    saveDataSet() {
      this.editDataSetDetail.token = 'Token d080a2576954dd32d250b2a94380d20292c67322';
      const { id, name, description, token, labelStudioProjectId } = this.editDataSetDetail;
      updateDataSet({ id, name, description, token, labelStudioProjectId }).then((res) => {
        if (res.code === '000000') {
          this.dataSetDetail = Object.assign(this.dataSetDetail, this.editDataSetDetail);
          this.$message.success('更新成功');
        }
      });
      this.isEditing = false;
      this.isShowDetailDialog = false;
    },
    // 取消保存
    cancelSave() {
      this.isEditing = false;
      this.isShowDetailDialog = false;
    },
    // 设置
    setOperation() {
      if (this.importTipType === 'loading') return;
      this.isIframeInSettings = true;
      this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/settings/labeling?token=d080a2576954dd32d250b2a94380d20292c67322`;
    },
    // 返回
    backCard() {
      if (this.isIframeInSettings) {
        this.isIframeInSettings = false;
        this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/data?token=d080a2576954dd32d250b2a94380d20292c67322`;
      } else if (this.isIframeLabelDetail) {
        this.isIframeLabelDetail = false;
        this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}`;
        setTimeout(() => {
          this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/data?token=d080a2576954dd32d250b2a94380d20292c67322`;
        }, 0);
      } else {
        this.$router.push({ path: '/data-manager/data-set/list' });
      }
    },
    openUploadDialog() {
      this.isShowUploadDialog = true;
    },
    saveUploadLabels(from) {
      // 无标签-原ls文件上传
      if (from.labelStatus === 'notLabeled') {
        const params = {
          file_upload_ids: from.notLabeledUploadSuccessId,
          files_as_tasks_list: false
        };
        this.isShowMessageDialog = true;
        this.messageType = 'loading';
        this.errorMessage = '';
        reimportFile(params, this.dataSetDetail.labelStudioProjectId).then((res) => {
          if (res) {
            this.messageType = 'notLabeledSuccess';
            setTimeout(() => {
              this.cancelMessage();
            }, 3000);
          } else {
            this.messageType = 'error';
            this.errorMessage = '网络异常';
          }
        }).catch((err) => {
          this.messageType = 'error';
          this.errorMessage = '网络异常';
          console.log(err);
        });
      } else {
        // 有标签-本地上传文件
        if (from.uploadType === 'local') {
          const params = {
            file_upload_ids: from.hasLabeledUploadSuccessId,
            template_id: from.labelTemplate,
            format_type_id: from.formatType
          };
          this.isShowMessageDialog = true;
          this.messageType = 'loading';
          this.errorMessage = '';
          submitFile(params, this.dataSetDetail.labelStudioProjectId).then((res) => {
            if (res.code === 0) {
              this.messageType = 'hasLabeledSuccess';
              setTimeout(() => {
                this.getLabelDatasetDetail();
                this.cancelMessage();
              }, 3000);
            } else {
              this.messageType = 'error';
              this.errorMessage = res.msg;
            }
          }).catch((err) => {
            this.messageType = 'error';
            this.errorMessage = '网络异常';
            console.log(err);
          });
        } else {
          this.isShowMessageDialog = true;
          this.messageType = 'loading';
          this.errorMessage = '';
          importFromDataset(from.selectedDataSet.labelStudioProjectId, this.dataSetDetail.labelStudioProjectId, {template_id: from.labelTemplate}).then((res) => {
            if (res.code === 0) {
              this.messageType = 'hasLabeledSuccess';
              this.getLabelDatasetDetail();
              setTimeout(() => {
                this.cancelMessage();
              }, 3000);
            } else {
              this.messageType = 'error';
              this.errorMessage = res.msg;
            }
          }).catch((err) => {
            this.messageType = 'error';
            this.errorMessage = err.response.data.exc_info;
            // console.log(err);
          });
        }
      }
    },
    cancelSaveUploadLabels() {
      this.isShowUploadDialog = false;
    },
    cancelMessage() {
      this.isShowMessageDialog = false;
      if (this.messageType === 'hasLabeledSuccess' || this.messageType === 'notLabeledSuccess') {
        this.isShowUploadDialog = false;
        // 刷新列表
        this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}`;
        setTimeout(() => {
          this.iframeUrl = `${this.labelStudioUrl}/projects/${this.dataSetDetail.labelStudioProjectId}/data?token=d080a2576954dd32d250b2a94380d20292c67322`;
        }, 0);
      }
    },
    cancelImportTip() {
      if (!this.isShowImportTip) return;
      this.isShowImportTip = false;
      if (this.importHistory && this.importHistory.status === 2) {
        changeImportHistory(this.dataSetDetail.labelStudioProjectId, this.importHistory.id).then((result) => {
          console.log(result);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mine-dataSet-container {
  width: 100%;
  height: calc(100vh - 110px);
  padding:16px;
  min-width: 1200px;
  .title-container {
    height: 50px;
    line-height: 50px;
    border-bottom: 2px solid rgba(223,223,223,1);
    background: #FFFFFF;
    box-shadow: 0 1px 0 0 rgba(221,221,221,1);
    color: #646464;
    padding: 0 16px;
    .title-content {
      display: inline-block;
      width: 50%;
      .svg-icon {
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .buttons-container {
      display: inline-block;
      text-align: right;
      width: 50%;
      position: relative;
      .import-history-container {
        font-size: 14px;
        width: 250px;
        text-align: left;
        height: 34px;
        line-height: 34px;
        border-radius: 4px;
        padding: 0px 16px;
        position: absolute;
        top: 8px;
        right: 225px;
        &.loading {
          background: rgba(1,100,255,0.14);
          color: #0164ff;
        }
        &.success {
          background: rgba(0,171,90,0.14);
          color: #00AB5A;
        }
        &.error {
          background: rgba(253,94,58,0.14);
          color: #FD5E3A;
        }
        .import-detail-container {
          display: inline-block;
          margin-left: 16px;
          width: 180px;
          overflow: hidden;
          .import-tip-container {
            display: inline-block;
            white-space: nowrap;
            &.scroll {
              animation: 16s wordsLoop linear infinite;
            }
          }
        }
        .el-icon-info {
          position: absolute;
          top: 10px;
          left: 16px;

        }
        .el-icon-close {
          position: absolute;
          top: 10px;
          right: 16px;
          cursor: pointer;
        }
      }
      .card-back-button {
        border: none;
        padding: 8px;
        color: #262626;
        .el-icon-caret-left {
          color: #d8d8d8;
        }
        &:hover {
          background: #ffffff;
          color: #262626;
          .el-icon-caret-left {
            color: #d8d8d8;
          }
        }
        &:focus {
          color: #0164FF;
          background: #ffffff;
          .el-icon-caret-left {
            background: #0164FF;
          }
        }
      }
    }
  }
  .content-container {
    padding: 24px;
    .loading-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 16px;
      animation: transformRotate 4s linear infinite;
    }
    .success-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 16px;
    }
    .error-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 16px;
    }
    .label-color {
      color: #0164FF;
    }
    .success-color {
      color: #00AB5A;
    }
    .error-color {
      color: #FD5E3A;
      & + .error-color {
        margin-top: 16px;
      }
    }
  }
}
@keyframes transformRotate {
  0%{
    transform:rotate(0deg);
  }
  100%{
    transform:rotate(360deg);
  }
}
@keyframes wordsLoop {
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(calc(-100% + 180px));
  }
  100% {
    transform: translateX(calc(-100% + 180px));
  }
  }
</style>
