<template>
  <div>
    <el-dialog
      v-dialogDrag
      top="15vh"
      title="导入数据"
      visible
      :width="width+'px'"
      :close-on-click-modal="false"
      :custom-class="'upload-dialog'"
      :before-close="cancelUpload"
    >
      <el-form ref="ruleFormEL" :model="ruleForm" :rules="rules" label-suffix=":" label-width="120px">
        <el-form-item label="数据标注状态" prop="labelStatus">
          <el-radio-group v-model="ruleForm.labelStatus" @change="changeLabelStatus">
            <el-radio v-for="item of labelStatusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <NotLabeledForm
        v-show="ruleForm.labelStatus === 'notLabeled'"
        ref="notLabeledFormEL"
        :detail-form.sync="notLabeledDetailForm"
        @showMessageDialog="openMessageDialog"
      />
      <HasLabeledForm
        v-show="ruleForm.labelStatus === 'hasLabeled'"
        ref="hasLabeledFormEL"
        :detail-form.sync="hasLabeledDetailForm"
        @showSelectDatasetDialog="openSelectDatasetDialog"
        @showMessageDialog="openMessageDialog"
      />
      <span slot="footer" class="dialog-footer">
        <el-button class="white-btn" @click="cancelUpload">{{ cancelBtnTitle }}</el-button>
        <el-button
          class="blue-btn"
          :disabled="(ruleForm.labelStatus === 'hasLabeled' && hasLabeledDetailForm.isFileLoading) || (ruleForm.labelStatus === 'notLabeled' && notLabeledDetailForm.isFileLoading)"
          @click="saveUpload"
        >{{ saveBtnTitle }}</el-button>
      </span>
    </el-dialog>
    <MessageDialog
      v-if="isShowMessageDialog"
      :title="messageTitle"
      :width="messageDialogWidth"
      :is-show-footer="false"
      :custom-class="messageType === 'uploadType' ? 'uploadType' : 'fileType'"
      @cancel="cancelMessage"
    >
      <div slot="content" class="content-container">
        <template v-if="messageType === 'uploadType'">
          <div v-for="(item, index) of uploadTooltipTitle" :key="index" class="margin-bottom-16">{{ item }}</div>
        </template>
        <template v-if="messageType === 'YOLO'">
          <YoloInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'VOC'">
          <VocInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'COCO'">
          <CocoInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'PNG'">
          <PngInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'CSV'">
          <CsvInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'SEGMENTATION'">
          <SegmentationInstance @download="downloadInstance" />
        </template>
        <template v-if="messageType === 'RECOGNITION'">
          <RecognitionInstance @download="downloadInstance" />
        </template>
      </div>
    </MessageDialog>
    <upload-file
      v-if="isShowSelectDatasetDialog"
      :is-show-tips="false"
      :is-show-label-template="true"
      :selected-type="dataSetType"
      :form-web-type="'dataset'"
      :selected-label-template-type="labelTemplateId"
      @ok="selectDatasetOk"
      @cancel="selectDatasetCancel"
    />
  </div>
</template>
<script>
import _debounce from 'lodash/debounce';
import NotLabeledForm from '@/views/data-manager/dataSet/components/NotLabeledForm';
import HasLabeledForm from '@/views/data-manager/dataSet/components/HasLabeledForm';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import UploadFile from '@/components/UploadFile';
import YoloInstance from '@/views/data-manager/dataSet/components/YoloInstance';
import VocInstance from '@/views/data-manager/dataSet/components/VocInstance';
import CocoInstance from '@/views/data-manager/dataSet/components/CocoInstance';
import PngInstance from '@/views/data-manager/dataSet/components/PngInstance';
import CsvInstance from '@/views/data-manager/dataSet/components/CsvInstance';
import SegmentationInstance from '@/views/data-manager/dataSet/components/SegmentationInstance';
import RecognitionInstance from '@/views/data-manager/dataSet/components/RecognitionInstance';
import { deleteUploadFileList } from '@/api/label-studio';
export default {
  components: {
    NotLabeledForm,
    HasLabeledForm,
    MessageDialog,
    UploadFile,
    YoloInstance,
    VocInstance,
    CocoInstance,
    PngInstance,
    CsvInstance,
    SegmentationInstance,
    RecognitionInstance
  },
  props: {
    width: {
      type: Number,
      default: 1200
    },
    cancelBtnTitle: {
      type: String,
      default: '取消'
    },
    saveBtnTitle: {
      type: String,
      default: '导入'
    },
    dataSetId: {
      type: [String, Number],
      default: '',
      required: true
    },
    dataSetType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelStatusOptions: [
        { 'value': 'notLabeled', 'label': '无标注信息' },
        { 'value': 'hasLabeled', 'label': '有标注信息' }
      ],
      notLabeledDetailForm: {
        notLabeledUploadSuccessId: [],
        isFileLoading: false,
        dataSetId: this.dataSetId
      },
      hasLabeledDetailForm: {
        labelTemplate: '',
        uploadType: '',
        formatType: '',
        selectedDataSet: {},
        hasLabeledUploadSuccessId: [],
        isFileLoading: false,
        dataSetId: this.dataSetId
      },
      ruleForm: {
        labelStatus: 'notLabeled'
      },
      rules: {
        labelStatus: [
          { required: true, message: '请选择数据标注状态', trigger: 'change' }
        ]
      },
      isShowMessageDialog: false, // 信息提示框显隐
      uploadTooltipTitle: [
        '1、上传已标注文件要求格式为zip格式压缩包,文件大小在500MB内;',
        '2、压缩包内需要的源文件及JSON格式标注文件,详情请阅读并下载示例;',
        '3、标注文件中标签需要按照规定格式写;',
        '4、如果是图片先上传到OSS,一个数据集放在一个文件夹中,文件名一致,URL一致。'
      ],
      messageTitle: '', // 信息提示框标题
      messageType: 'upload',
      messageDialogWidth: 400,
      isShowSelectDatasetDialog: false,
      downloadInstanceUrl: '',
      labelTemplateId: ''
    };
  },
  methods: {
    changeLabelStatus(value) {
      if (value === 'notLabeled') {
        if (this.$refs.hasLabeledFormEL.showFileList.length > 0) {
          this.$refs.hasLabeledFormEL.showFileList = [];
        }
        if (this.hasLabeledDetailForm.hasLabeledUploadSuccessId.length > 0) {
          deleteUploadFileList({ file_upload_ids: this.hasLabeledDetailForm.hasLabeledUploadSuccessId }, this.dataSetId)
            .then(() => {
            })
            .catch(() => {});
          this.$refs.hasLabeledFormEL.showFileList = [];
          this.hasLabeledDetailForm.hasLabeledUploadSuccessId = [];
        }
      } else {
        if (this.$refs.notLabeledFormEL.showFileList.length > 0) {
          this.$refs.notLabeledFormEL.showFileList = [];
        }
        if (this.notLabeledDetailForm.notLabeledUploadSuccessId.length > 0) {
          deleteUploadFileList({ file_upload_ids: this.notLabeledDetailForm.notLabeledUploadSuccessId }, this.dataSetId)
            .then(() => {})
            .catch(() => {});
          this.$refs.notLabeledFormEL.showFileList = [];
          this.notLabeledDetailForm.notLabeledUploadSuccessId = [];
        }
      }
      // this.$refs.ruleFormEL.clearValidate();
    },
    // 取消按钮
    cancelUpload() {
      if (this.ruleForm.labelStatus === 'notLabeled') {
        deleteUploadFileList({ file_upload_ids: this.notLabeledDetailForm.notLabeledUploadSuccessId }, this.dataSetId)
          .then(() => {})
          .catch(() => {});
      } else {
        deleteUploadFileList({ file_upload_ids: this.hasLabeledDetailForm.hasLabeledUploadSuccessId }, this.dataSetId)
          .then(() => {})
          .catch(() => {});
      }
      this.$emit('cancel');
    },
    // 确定按钮
    saveUpload: _debounce(function() {
      this.$refs['ruleFormEL'].validate((valid) => {
        if (valid) {
          if (this.ruleForm.labelStatus === 'notLabeled') {
            this.$refs.notLabeledFormEL.$refs.ruleFormEL.validate((valid) => {
              if (valid) {
                this.$emit('save', { ...this.ruleForm, ...this.notLabeledDetailForm });
              } else {
                return false;
              }
            });
          } else {
            this.$refs.hasLabeledFormEL.$refs.ruleFormEL.validate((valid) => {
              if (valid) {
                this.$emit('save', { ...this.ruleForm, ...this.hasLabeledDetailForm });
              } else {
                return false;
              }
            });
          }
        } else {
          return false;
        }
      });
    }, 300),
    // 打开上传信息提示框
    openMessageDialog(Object) {
      this.isShowMessageDialog = true;
      this.downloadInstanceUrl = '';
      if (Object.tag === 'upload') {
        this.messageTitle = '上传说明';
        this.messageType = 'uploadType';
        this.messageDialogWidth = 480;
      } else {
        this.messageTitle = '说明';
        this.messageType = Object.tag;
        this.downloadInstanceUrl = Object.example_url;
        this.messageDialogWidth = 900;
      }
    },
    // 取消信息提示框
    cancelMessage() {
      this.isShowMessageDialog = false;
    },
    downloadInstance() {
      window.location.href = this.downloadInstanceUrl;
    },
    openSelectDatasetDialog(labelTemplate) {
      this.labelTemplateId = labelTemplate;
      this.isShowSelectDatasetDialog = true;
    },
    selectDatasetOk(data) {
      this.hasLabeledDetailForm.selectedDataSet = data;
      this.$refs.hasLabeledFormEL.$refs.ruleFormEL.clearValidate('selectedDataSet');
      this.selectDatasetCancel();
    },
    selectDatasetCancel() {
      this.isShowSelectDatasetDialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .upload-dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242,242,242,1);
      .el-dialog__title {
        font-family: SourceHanSansSC-Bold;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 16px;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      padding: 24px 72px;
      text-align: left;
    }
    .el-dialog__footer {
      padding: 24px;
      padding-top: 0;
    }
    .el-form-item__label {
      font-weight: 400;
    }
  }
  .message-dialog {
    margin-top: 15vh !important;
    &.uploadType {
      .el-dialog__body {
        padding: 24px 64px;
      }
    }
    &.fileType {
      .el-dialog__body {
        padding: 24px;
      }
    }
    .content-container {
      text-align: left;
      font-size: 12px;
    }
  }
}
</style>
