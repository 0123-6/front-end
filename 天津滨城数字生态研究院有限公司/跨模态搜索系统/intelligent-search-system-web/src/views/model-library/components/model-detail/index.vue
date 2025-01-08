<template>
  <div class="model-detail-container">
    <div class="model-detail-card">
      <div class="model-detail-short-desc">
        <el-image :src="modelDetailData.coverUrl" fit="fill" style="width: 288px; height: 148px; border-radius: 4px">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div class="model-info">
          <p>{{ modelDetailData && modelDetailData.modelNameCh }}</p>
          <el-tooltip class="item" effect="dark" :content="modelDetailData.modelShortDescribe"
                      :disabled="modelDetailData.modelShortDescribe && modelDetailData.modelShortDescribe.length <= 116" placement="top">
            <p style="height: 47px;">{{ modelDetailData.modelShortDescribe }}</p>
          </el-tooltip>
          <div style="display: flex; justify-content: space-between">
            <div>
              <div class="textDesc">
                <span style="margin-right: 20px;">版本: {{ modelDetailData.versionName }}</span><span>更新时间: {{ modelDetailData.updateTime}}</span>
              </div>
              <div class="modelType">
                <span>{{ modelDetailData.scenesName }}</span>
                <span>{{ modelDetailData.modelTypeName }}</span>
              </div>
            </div>
            <el-button
              v-if="modelApplyButtonParams.buttonVisible"
              :disabled="modelApplyButtonParams.expire === 1"
              class="primary plain"
              @click="applyModel(modelDetailData.id)"
            >应用</el-button>
          </div>
        </div>
      </div>
      <div class="model-detail-long-desc">
        <TextStyle title="模型描述" :font-size="16" style="margin: 0 0 20px" />
<!--        <div class="model-detail-long-desc-title">模型解决问题：</div>-->
<!--        <div  class="model-detail-long-desc-content">{{modelDetailData.modelDescribe}}</div>-->
        <viewer
          v-if="modelDetailData.modelDescribe"
          class="model-detail-long-desc-content"
          height="300px"
          :initialValue="modelDetailData.modelDescribe" />
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
    <ApplyDialog
      v-if="applyDialogVisible"
      :detail="applyDialogDetail"
      :state="applyDialogState"
      @cancel="cancelApply"
      @save="saveApply"
    ></ApplyDialog>
  </div>
</template>

<script>
import { Viewer } from '@toast-ui/vue-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { getModelDetailData } from '@/api/model-library';
import { addModelDevice } from '@/api/model-manage';
import TextStyle from '@/components/TextStyle';
import ApplyDialog from '@/views/system-manager/model-manager/components/ApplyDialog.vue';
import MessageDialog from '@/components/MessageDialog';

export default {
  name: 'ModelDetail',
  components: {
    TextStyle,
    viewer: Viewer,
    ApplyDialog,
    MessageDialog
  },
  data() {
    return {
      modelId: this.$route.params.id,
      modelDetailData: {},
      messageDialogVisible: false, // 信息提示框显隐
      messageTitle: '', // 信息提示框标题
      messageContent: '', // 信息提示框内容
      applyDialogVisible: false,
      applyDialogState: 'create',
      applyDialogDetail: {},
      modelApplyButtonParams: {},
      selectedDeviceIds: []
    };
  },
  created() {
    this.modelApplyButtonParams = JSON.parse(sessionStorage.getItem('modelApplyButtonParams'));
    this.getModelDetail();
  },
  methods: {
    async getModelDetail() {
      const params = {
        modelId: parseInt(this.modelId, 10)
      };
      await getModelDetailData(params).then((res) => {
        if (res.code === '000000') {
          this.modelDetailData = res.data;
        } else {
          //
        }
      });
    },
    // 显示应用弹框
    applyModel() {
      this.applyDialogDetail = { id: this.modelDetailData.id, name: this.modelDetailData.modelNameCh };
      this.selectedDeviceIds = [];
      const time = new Date().getTime() - new Date(this.modelApplyButtonParams.expiryTimeEnd).getTime();
      if (this.modelApplyButtonParams.expire !== 2) {
        this.applyDialogVisible = false;
      } else if (time >= 24 * 60 * 60 * 1000) {
        this.messageDialogVisible = true;
        this.messageTitle = '提示';
        this.messageContent = '模型即将到期,不可应用于监控点!';
      } else {
        this.applyDialogVisible = true;
      }
    },
    // 保存应用
    saveApply(selectedData) {
      this.selectedDeviceIds = selectedData.map((item) => item.id);
      const params = {
        deviceIds: this.selectedDeviceIds,
        modelIds: [this.applyDialogDetail.id]
      };
      addModelDevice(params).then((result) => {
        if (result.code === '000000') {
          this.$message({
            type: 'success',
            message: '模型应用成功，生效时间稍有延长，请耐心等待'
          });
          this.cancelApply();
        }
      }).catch((err) => {
      });
    },
    // 取消应用
    cancelApply() {
      this.applyDialogVisible = false;
    },
    // 取消信息提示框
    cancelMessage() {
      this.messageDialogVisible = false;
    },
    // 保存信息提示框
    saveMessage() {
      this.cancelMessage();
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.model-detail-container {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
  .model-detail-card{
    width: 1200px;
    min-height: calc(100% - 48px);
    margin: 24px auto;
    padding: 28px 32px;
    background: #fdfefe;
    box-shadow: 0 9px 15px 0 rgba(229,236,241,1);
    border-radius: 4px;
    overflow: auto;
    .model-detail-short-desc {
      display: flex;
      align-items: start;
      .model-info{
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 148px;
        margin-left: 24px;
        >p:nth-child(1){
          font-family: SourceHanSansSC-Bold;
          font-size: 16px;
          color: @text-primary-dark;
          font-weight: 700;
        }
        >p:nth-child(2) {
          font-family: SourceHanSansSC-Regular;
          font-size: 14px;
          color: @text-lighter;
          margin: 10px 0;
          font-weight: 400;
          .ellipsis-muti-line(2);
        }
        .textDesc{
          font-family: SourceHanSansSC-Regular;
          font-size: 14px;
          color: @text-lighter;
          font-weight: 400;
        }
        .modelType{
          >span{
            display: inline-block;
            padding: 4px 24px;
            border-radius: 4px;
            font-family: SourceHanSansSC-Normal;
            font-size: 12px;
            text-align: center;
            font-weight: 400;
            margin: 10px 8px 0 0;
          }
          >span:nth-child(1){
            color: #0C61AA;
            background: rgba(12, 97, 170, 0.16);
          }
          >span:nth-child(2){
            color: #098E98;
            background: rgba(9 ,142, 152, 0.16);
          }
        }
        .el-button{
          width: 96px;
          height: 32px;
        }
      }
    }
    .model-detail-long-desc {
      height: calc(100% - 180px);
      margin-top: 32px;
      .model-detail-long-desc-title{
        font-family: SourceHanSansSC-Medium;
        font-size: 14px;
        color: @text-primary;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .model-detail-long-desc-content{
        font-family: SourceHanSansSC-Regular;
        font-size: 14px;
        color: @text-lighter;
        font-weight: 400;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
