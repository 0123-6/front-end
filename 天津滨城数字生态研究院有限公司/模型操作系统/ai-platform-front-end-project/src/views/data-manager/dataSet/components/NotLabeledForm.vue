<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-30 15:15:31
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-03 17:15:22
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\NotLabeldFrom.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-form ref="ruleFormEL" class="notLabelFrom-container" :model="ruleForm" :rules="rules" label-suffix=":" label-width="120px">
      <el-form-item label="上传文件" prop="notLabeledUploadSuccessId">
        <el-input v-model="uploadAddress" class="upload-address-input-el" placeholder="请输入数据集地址">
          <template slot="append">
            <el-button :class="{'blue-btn': uploadAddress.trim() != ''}" @click="addUploadAddress">添加地址</el-button>
          </template>
        </el-input>
        <span class="margin-left-8 margin-right-8">或者</span>
        <el-upload
          ref="uploadEL"
          class="click-upload-container"
          multiple
          action="string"
          :before-upload="onBeforeUploadFile"
          :http-request="uploadFile"
          :on-change="changeFile"
          :file-list="uploadingFileList"
          :show-file-list="false"
        >
          <el-button><svg-icon class-name="dataSet-upload-icon" icon-class="dataSet-upload" class="margin-right-8" />上传{{ showFileList.length > 0 ?'更多':'' }}文件</el-button>
        </el-upload>
        <!-- <svg-icon class-name="question-icon" icon-class="question" class="margin-left-8 svg-button" @click="openMessageDialog({value: 'upload'})" /> -->
        <span v-if="ruleForm.notLabeledUploadSuccessId.length > 0" class="file-tooltip-container">已上传{{ ruleForm.notLabeledUploadSuccessId.length }}个文件</span>
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
      <el-upload
        v-if="showFileList.length === 0"
        ref="dragUploadEL"
        class="drag-upload-container"
        drag
        multiple
        action="string"
        :before-upload="onBeforeUploadFile"
        :http-request="uploadFile"
        :on-change="changeDragFile"
        :file-list="uploadingFileList"
        :show-file-list="false"
      >
        <div class="el-upload__text">
          <div class="top-remark-container">将文件拖到此处，或点击上传</div>
          <svg-icon class-name="dataSet-upload-icon" icon-class="dataSet-upload" />
          <el-form label-width="100px" class="file-type-options-container">
            <el-form-item v-for="(item, index) of uploadFileTypeOptions" :key="index" :label="item.label">
              <div>{{ item.value }}</div>
            </el-form-item>
          </el-form>
        </div>
      </el-upload>
    </el-form>
  </div>
</template>
<script>
import { importFile, getUploadFileList, deleteUploadFileList } from '@/api/label-studio';
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
      if (this.ruleForm.notLabeledUploadSuccessId.length === 0) {
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
    return {
      uploadFileTypeOptions: [
        { value: 'txt', label: '文本' },
        { value: 'wav,aiff,mp3,au,flac,m4a,ogg', label: '音频' },
        { value: 'jpg,png,gif,bmp,svg,webp', label: '图像' },
        { value: 'html,htm,xml', label: 'HTML' },
        { value: 'csv,tsv', label: '时间序列' },
        { value: 'csv,tsv,txt,json', label: '通用格式' }
      ],
      rules: {
        notLabeledUploadSuccessId: [
          { required: true, validator: validateSuccessId, trigger: 'blur' }
        ]
      },
      uploadAddress: '',
      // 上传相关
      uploadingFileList: [],
      showFileList: []
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
  methods: {
    addUploadAddress() {
      if (this.uploadAddress.trim() === '') return;
      const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(this.uploadAddress)) return;
      this.$refs.ruleFormEL.clearValidate('notLabeledUploadSuccessId');
      this.showFileList.unshift({ 'name': this.uploadAddress, 'status': 'loading' }); // 取出上传文件的对象，在其它地方也可以使用
      const searchParams = new URLSearchParams({ 'url': this.uploadAddress });
      this.uploadAddress = '';
      this.ruleForm.isFileLoading = true;
      importFile(searchParams, this.detailForm.dataSetId).then((res) => {
        this.ruleForm.isFileLoading = false;
        this.ruleForm.notLabeledUploadSuccessId = this.ruleForm.notLabeledUploadSuccessId.concat(res.file_upload_ids);
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
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 500;
      // if (!isIMAGE) {
      //   this.$message.error('上传文件只能是图片格式!')
      // }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过500MB!请选择上传地址导入的方式');
      } else {
        this.showFileList.unshift(file); // 取出上传文件的对象，在其它地方也可以使用
        this.showFileList[0].status = 'loading';
      }
      // return isIMAGE && isLt1M;
      return isLt1M;
    },
    uploadFile(param) {
      const formData = new FormData();
      formData.append(param.file.name, param.file);
      this.ruleForm.isFileLoading = true;
      importFile(formData, this.detailForm.dataSetId).then(res => {
        this.ruleForm.isFileLoading = false;
        param.onSuccess(); // 上传成功的图片会显示绿色的对勾
        this.ruleForm.notLabeledUploadSuccessId = this.ruleForm.notLabeledUploadSuccessId.concat(res.file_upload_ids);
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
    changeDragFile(file) {
      this.$refs.dragUploadEL.clearFiles(); // 清除文件对象
      // 重新手动赋值fileList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
      this.uploadingFileList = [{ name: file.name, url: file.url }];
    },
    getUploadFileLists() {
      getUploadFileList({ ids: JSON.stringify(this.ruleForm.notLabeledUploadSuccessId) }, this.detailForm.dataSetId).then(res => {
        this.$refs.ruleFormEL.clearValidate('notLabeledUploadSuccessId');
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
            this.ruleForm.notLabeledUploadSuccessId.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    openMessageDialog(Object) {
      Object.tag = Object.value;
      this.$emit('showMessageDialog', Object);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .notLabelFrom-container {
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
    .svg-button {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }
    .click-upload-container {
      display: inline-block;
    }
    .drag-upload-container {
      text-align: center;
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
        left: 32px;
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
          top: 4px;
          margin-left: 16px;
          cursor: pointer;
          &:hover {
            color: #0164FF;
          }
        }
      }
    }
  }
}
</style>
