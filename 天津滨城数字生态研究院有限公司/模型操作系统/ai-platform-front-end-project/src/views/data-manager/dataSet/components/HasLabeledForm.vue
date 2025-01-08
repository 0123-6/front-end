<template>
  <div>
    <el-form ref="ruleFormEL" class="hasLabelFrom-container" :model="ruleForm" :rules="rules" label-suffix=":" label-width="120px">
      <el-form-item label="标注模板" prop="labelTemplate">
        <el-cascader
          ref="cascaderEl"
          v-model="ruleForm.labelTemplate"
          :options="labelTemplateOptions"
          :props="cascaderProps"
          :disabled="isLabelTemplateDisabled"
          clearable
          class="cascader-select-el"
          popper-class="cascader-select-dropdown-el"
          @change="changeLabelTemplate"
        />
      </el-form-item>
      <el-form-item label="导入方式" prop="uploadType">
        <el-select v-model="ruleForm.uploadType" placeholder="请选择" class="select-el" @change="changeUploadType">
          <el-option
            v-for="item in uploadTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.uploadType === 'local' && formatTypeOptions.length != 0" label="标注格式" prop="formatType">
        <el-radio-group v-model="ruleForm.formatType" class="formatType-radio-el" @change="changeFormatType">
          <span v-for="item of formatTypeOptions" :key="item.id">
            <el-radio :label="item.id">
              {{ item.title }}
            </el-radio>
            <svg-icon class-name="question-icon" icon-class="question" class="margin-left-8 svg-button" @click="openMessageDialog(item)" />
          </span>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.uploadType === 'platform'" label="数据集" prop="selectedDataSet">
        <el-input v-model="ruleForm.selectedDataSet.name" class="dataSet-input-el margin-right-8" clearable readonly />
        <el-button type="primary" plain @click="openSelectDatasetDialog">选择数据集</el-button>
      </el-form-item>
      <el-form-item v-if="ruleForm.uploadType === 'local'" label="上传文件" prop="hasLabeledUploadSuccessId" class="uploader-form-item">
        <el-upload
          ref="uploadEL"
          class="click-upload-container"
          action="string"
          :accept="'.zip'"
          :before-upload="onBeforeUploadFile"
          :http-request="uploadFile"
          :on-change="changeFile"
          :file-list="uploadingFileList"
          :show-file-list="false"
          :disabled="showFileList.length > 0"
        >
          <el-button :disabled="showFileList.length > 0">
            <svg-icon
              :class-name="showFileList.length > 0 ? 'dataSet-upload-disabled-icon' : 'dataSet-upload-icon'"
              :icon-class="showFileList.length > 0 ? 'dataSet-upload-disabled' : 'dataSet-upload'"
              class="margin-right-8"
            />
            上传{{ showFileList.length > 1 ?'更多':'' }}文件
          </el-button>
        </el-upload>
        <svg-icon class-name="question-icon" icon-class="question" class="margin-left-8 svg-button" @click="openMessageDialog({title: 'upload'})" />
        <span v-if="ruleForm.hasLabeledUploadSuccessId.length > 0" class="file-tooltip-container">已上传{{ ruleForm.hasLabeledUploadSuccessId.length }}个文件</span>
        <span class="margin-left-8 margin-right-8">或者</span>
        <el-input v-model="uploadAddress" class="upload-address-input-el" placeholder="请输入数据集地址" :disabled="showFileList.length > 0">
          <template slot="append">
            <el-button :class="{'blue-btn': uploadAddress.trim() != ''}" @click="addUploadAddress">添加地址</el-button>
          </template>
        </el-input>
      </el-form-item>
      <div class="upload-list-container">
        <div v-for="(item, index) of showFileList" :key="item.name + index">
          <span class="file-name-container" :title="item.name">
            <span class="file-name-detail-container">{{ item.name }}</span>
            <i v-if="item.status !== 'loading'" class="el-icon-circle-close delete-button" @click="deleteDownloadFile(item,index)" />
          </span>
          <Progress :key="item.name" :status="item.status" :title="item.status === 'error'?item.errormsg:''" />
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getUploadFileList, getLabelDatasetFormateConfig, importFile, deleteUploadFileList, getLabelDatasetDetail } from '@/api/label-studio';
import Progress from './Progress';
export default {
  components: {
    Progress
  },
  props: {
    detailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    var validateSuccessId = (rule, value, callback) => {
      const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (this.ruleForm.hasLabeledUploadSuccessId.length === 0) {
        if (this.uploadAddress.trim() === '') {
          callback(new Error('请上传文件'));
        } else {
          if (!reg.test(this.uploadAddress)) {
            callback(new Error('请输入有效连接'));
          } else {
            callback('请点击添加地址');
          }
        }
      } else {
        if (this.uploadAddress.trim() === '') {
          callback();
        } else {
          if (!reg.test(this.uploadAddress)) {
            callback(new Error('请输入有效连接'));
          } else {
            callback();
          }
        }
        callback();
      }
    };
    var validateSelectedDataSet = (rule, value, callback) => {
      if (Object.keys(value).length === 0) {
        callback(new Error('请选择数据集'));
      } else {
        callback();
      }
    };
    return {
      cascaderProps: {
        'value': 'id',
        'label': 'title_cn',
        'children': 'templates',
        'emitPath': false
      },
      labelTemplateOptions: [],
      uploadTypeOptions: [
        { 'value': 'local', 'label': '本地导入' },
        { 'value': 'platform', 'label': '平台已有数据集' }
      ],
      formatTypeOptions: [],
      rules: {
        labelTemplate: [
          { required: true, message: '请选择标签模板', trigger: 'change' }
        ],
        uploadType: [
          { required: true, message: '请选择导入方式', trigger: 'change' }
        ],
        formatType: [
          { required: true, message: '请选择文本格式', trigger: 'change' }
        ],
        selectedDataSet: [
          { required: true, validator: validateSelectedDataSet, trigger: 'blur' }
        ],
        hasLabeledUploadSuccessId: [
          { required: true, validator: validateSuccessId, trigger: 'blur' }
        ]
      },
      uploadAddress: '',
      // 上传相关
      uploadingFileList: [],
      showFileList: [],
      isLabelTemplateDisabled: false
    };
  },
  computed: {
    ruleForm: {
      get() {
        return this.detailForm;
      },
      set(newValue) {
        this.$emit('update:detailForm', newValue);
      }
    }
  },
  mounted() {
    this.getLabelDatasetConfig();
    this.getLabelDatasetDetail();
  },
  methods: {
    getLabelDatasetDetail() {
      getLabelDatasetDetail(this.detailForm.dataSetId).then((res) => {
        if (res) {
          this.ruleForm.labelTemplate = res.template_id;
          if (this.ruleForm.labelTemplate) {
            this.isLabelTemplateDisabled = true;
          }
        }
      });
    },
    getLabelDatasetConfig() {
      getLabelDatasetFormateConfig().then((res) => {
        this.labelTemplateOptions = res;
      });
    },
    changeLabelTemplate() {
      this.ruleForm.formatType = '';
      if (this.$refs.cascaderEl.getCheckedNodes().length > 0 && this.$refs.cascaderEl.getCheckedNodes()[0].data) {
        this.formatTypeOptions = this.$refs.cascaderEl.getCheckedNodes()[0].data['formate_types'];
        this.ruleForm.formatType = this.formatTypeOptions[0].id;
      } else {
        this.formatTypeOptions = [];
      }
      if (this.ruleForm.uploadType === 'platform') {
        this.ruleForm.selectedDataSet = {};
      } else {
        if (this.showFileList.length > 0) {
          this.showFileList = [];
        }
        if (this.ruleForm.hasLabeledUploadSuccessId.length > 0) {
          deleteUploadFileList({ file_upload_ids: this.ruleForm.hasLabeledUploadSuccessId }, this.detailForm.dataSetId)
            .then(() => {
            })
            .catch(() => {});
          this.showFileList = [];
          this.ruleForm.hasLabeledUploadSuccessId = [];
        }
      }
    },
    changeUploadType(value) {
      this.$refs.ruleFormEL.clearValidate();
      if (value === 'platform') {
        if (this.showFileList.length > 0) {
          this.showFileList = [];
        }
        if (this.ruleForm.hasLabeledUploadSuccessId.length > 0) {
          deleteUploadFileList({ file_upload_ids: this.ruleForm.hasLabeledUploadSuccessId }, this.detailForm.dataSetId)
            .then(() => {
            })
            .catch(() => {});
          this.showFileList = [];
          this.ruleForm.hasLabeledUploadSuccessId = [];
        }
      } else {
        this.ruleForm.selectedDataSet = {};
        if (this.$refs.cascaderEl.getCheckedNodes().length > 0) {
          this.formatTypeOptions = this.$refs.cascaderEl.getCheckedNodes()[0].data['formate_types'];
          this.ruleForm.formatType = this.formatTypeOptions[0].id;
        } else {
          this.formatTypeOptions = [];
        }
      }
    },
    changeFormatType() {
      if (this.showFileList.length > 0) {
        this.showFileList = [];
      }
      if (this.ruleForm.hasLabeledUploadSuccessId.length > 0) {
        deleteUploadFileList({ file_upload_ids: this.ruleForm.hasLabeledUploadSuccessId }, this.detailForm.dataSetId)
          .then(() => {
          })
          .catch(() => {});
        this.showFileList = [];
        this.ruleForm.hasLabeledUploadSuccessId = [];
      }
    },
    addUploadAddress() {
      if (this.uploadAddress.trim() === '') return;
      if (this.showFileList.length > 0) return;
      const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(this.uploadAddress)) return;
      this.$refs.ruleFormEL.clearValidate('hasLabeledUploadSuccessId');
      this.showFileList.unshift({ 'name': this.uploadAddress, 'status': 'loading' }); // 取出上传文件的对象，在其它地方也可以使用
      const searchParams = new URLSearchParams({ 'url': this.uploadAddress });
      this.uploadAddress = '';
      this.ruleForm.isFileLoading = true;
      importFile(searchParams, this.detailForm.dataSetId).then((res) => {
        this.ruleForm.isFileLoading = false;
        this.ruleForm.hasLabeledUploadSuccessId = this.ruleForm.hasLabeledUploadSuccessId.concat(res.file_upload_ids);
        this.getUploadFileLists();
      }).catch((err) => {
        this.ruleForm.isFileLoading = false;
        if (err.response.data.validation_errors) {
          this.showFileList[0].errormsg = err.response.data.validation_errors.non_field_errors[0];
        } else {
          this.showFileList[0].errormsg = '网络异常';
        }
        this.showFileList[0].status = 'error';
      });
    },
    onBeforeUploadFile(file) {
      const isIMAGE = file.name.endsWith('.zip');
      const isLt1M = file.size / 1024 / 1024 < 500;
      if (!isIMAGE) {
        this.$message.error('上传文件只能是zip格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过500MB!请选择上传地址导入的方式');
      }
      if (isIMAGE && isLt1M) {
        this.showFileList.unshift(file); // 取出上传文件的对象，在其它地方也可以使用
        this.showFileList[0].status = 'loading';
      }
      return isIMAGE && isLt1M;
    },
    uploadFile(param) {
      const formData = new FormData();
      formData.append(param.file.name, param.file);
      this.ruleForm.isFileLoading = true;
      importFile(formData, this.detailForm.dataSetId).then(res => {
        // console.log('上传图片成功');
        this.ruleForm.isFileLoading = false;
        param.onSuccess(); // 上传成功的图片会显示绿色的对勾
        this.ruleForm.hasLabeledUploadSuccessId = this.ruleForm.hasLabeledUploadSuccessId.concat(res.file_upload_ids);
        this.getUploadFileLists();
      }).catch((err) => {
        this.ruleForm.isFileLoading = false;
        if (err.response.data.validation_errors) {
          this.showFileList[0].errormsg = err.response.data.validation_errors.non_field_errors[0];
        } else {
          this.showFileList[0].errormsg = '网络异常';
        }
        this.showFileList[0].status = 'error';
        param.onError();
      });
    },
    changeFile(file) {
      this.$refs.uploadEL.clearFiles(); // 清除文件对象
      // 重新手动赋值fileList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
      this.uploadingFileList = [{ name: file.name, url: file.url }];
    },
    getUploadFileLists() {
      getUploadFileList({ ids: JSON.stringify(this.ruleForm.hasLabeledUploadSuccessId) }, this.detailForm.dataSetId).then(res => {
        this.$refs.ruleFormEL.clearValidate('hasLabeledUploadSuccessId');
        // 展示的文件列表
        // 反转数组
        const newArray = res.slice().reverse();
        // 替换数组
        newArray.forEach((item, index) => {
          item.name = item.file;
          item.status = 'success';
          this.showFileList.splice(index, 1, item);
        });
      }).catch(error => {
        console.log(error);
      });
    },
    deleteDownloadFile(param, index) {
      deleteUploadFileList({ file_upload_ids: [param.id] }, this.detailForm.dataSetId)
        .then(() => {
          this.showFileList.splice(index, 1);
          if (param.status === 'success') {
            this.ruleForm.hasLabeledUploadSuccessId.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    openSelectDatasetDialog() {
      this.$emit('showSelectDatasetDialog', this.ruleForm.labelTemplate);
    },
    openMessageDialog(Object) {
      if (Object.title === 'JSON') {
        if (this.ruleForm.labelTemplate + '' === '38') {
          Object.tag = 'SEGMENTATION';
        } else if (this.ruleForm.labelTemplate + '' === '17') {
          Object.tag = 'RECOGNITION';
        }
      } else {
        Object.tag = Object.title;
      }
      this.$emit('showMessageDialog', Object);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .hasLabelFrom-container {
    .el-form-item__label {
      font-weight: 400;
    }
    .upload-address-input-el {
      width: 500px;
      .el-input-group__append {
        background: #ffffff;
      }
      .blue-btn {
        background: #0164FF !important;
        color: #ffffff !important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .cascader-select-el {
      width: 500px;
    }
    .select-el {
      width: 500px;
    }
    .dataSet-input-el {
      width: 380px;
    }
    .formatType-radio-el {
      .svg-button {
        position: relative;
        top: 2px;
        right: 30px;
      }
    }
    .svg-button {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }
    .click-upload-container {
      display: inline-block;
    }
    .drag-upload-container {
      width: 540px;
      margin: 32px auto;
      .el-upload-dragger {
        border: none;
        height: 400px;
      }
      .top-remark-container {
        font-size: 24px;
        font-weight: 800;
        line-height: 32px;
        text-align: center;
      }
      .dataSet-upload-icon {
        width: 48px;
        height: 64px;
        margin: 32px auto;
      }
      .file-type-options-container {
        left: 120px;
        width: 400px;
        position: relative;
        .el-form-item {
          margin-bottom: 0px;
          .el-form-item__label {
            text-align: left;
          }
          .el-form-item__content {
            text-align: left;
          }
        }
      }
    }
    .file-tooltip-container {
      float: right;
    }
    .upload-list-container {
      padding-left: 120px;
      .file-name-container {
        display: inline-block;
        width: 500px;
        position: relative;
        height: 20px;
        line-height: 20px;
        .file-name-detail-container {
          max-width: 460px;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .delete-button {
          position: absolute;
          top: 2px;
          margin-left: 16px;
          cursor: pointer;
          &:hover {
            color: #0164FF;
          }
        }
      }
    }
    .upload-list-container {
      padding-left: 120px;
    }
    .uploader-form-item  {
      .el-form-item__error {
        margin-left: 190px;
      }
    }
  }
}
</style>
<style lang="scss">
.cascader-select-dropdown-el {
  .el-cascader-menu__wrap {
    height: inherit;
    max-height: 200px;
  }
}
</style>
