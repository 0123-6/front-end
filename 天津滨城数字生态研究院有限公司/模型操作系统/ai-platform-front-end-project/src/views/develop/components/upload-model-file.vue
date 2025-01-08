<template>
  <div class="upload-model-file">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix=":"
      :disabled="flag === 2"
    >
      <el-form-item label-width="130px" label="模型文件" prop="modelFileName">
        <el-upload
          :action="actionUrl"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :file-list="modelFileList"
        >
          <el-button size="small" type="primary" icon="el-icon-plus" plain style="width: 100%;height: 36px">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label-width="130px" label="文件名称" prop="userDefinedFileName">
        <el-input v-model="form.userDefinedFileName" style="width: 80%;" />
      </el-form-item>
      <el-form-item label-width="130px" label="模型格式" prop="modelFileType">
        <el-select
          v-model="form.modelFileType"
          placeholder="请选择运行框架"
          clearable
          style="width: 80%;"
          @change="handleSelectFileType"
        >
          <el-option
            v-for="item in runFrameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { saveModelFile, modelFileInfo } from '@/api/model.js';

export default {
  data() {
    return {
      flag: 0,
      modelFileList: [],
      actionUrl: process.env.NODE_ENV === 'development' ? '/api/backend/file?signature=AppWeb00123' : '/backend/file?signature=AppWeb00123',
      form: {
        id: '',
        modelFileName: '', // 模型文件名称
        userDefinedFileName: '', // 用户自定义模型名称
        modelFileType: '', // 模型文件格式
        fileId: ''
      },
      runFrameOptions: [
        { value: 0, label: 'SKLEARN' },
        { value: 1, label: 'XGBOOST' },
        { value: 2, label: 'LIGHTGBM' },
        { value: 3, label: 'TENSORFLOW' },
        { value: 4, label: 'PYTORCH' }
      ],
      rules: {
        modelFileName: [
          {
            required: true,
            message: '请上传模型文件',
            trigger: 'change'
          }
        ],
        userDefinedFileName: [
          {
            required: true,
            message: '请输入模型文件名称',
            trigger: 'change'
          }
        ],
        modelFileType: [
          {
            required: true,
            message: '请选择模型文件格式',
            trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    /** 上传模型文件格式校验 */
    beforeUpload(file) {
      const isExtension = file.name.substr(file.name.indexOf('.'), file.name.length);
      const extensionArray = ['.joblib', '.bst', '.zip'];
      if (!extensionArray.includes(isExtension)) {
        this.$message.error('模型文件只能上传后缀名为joblib,bst,zip格式的文件!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!isLt2M) {
        this.$message.error('上传模型文件大小不能超过500MB');
        return false;
      }
      return isExtension && isLt2M;
    },
    /** 模型文件上传成功 */
    handleUploadSuccess(res, file) {
      if (res.code === '000000') {
        this.form.modelFileName = res.data[0].filename;
        this.form.fileId = res.data[0].id;
      }
    },
    /** 根据模型文件类型校验对应的后缀名 */
    handleSelectFileType(val) {
      if (this.form.modelFileName !== '') {
        const fileType = this.form.modelFileName.substr(this.form.modelFileName.indexOf('.'), this.form.modelFileName.length);
        if (val === 0 && fileType !== '.joblib') {
          this.$message.error(`模型格式为${this.runFrameOptions[val].label}的文件,请上传后缀名为.joblib的文件`);
          return false;
        } else if ((val === 1 || val === 2) && fileType !== '.bst') {
          this.$message.error(`模型格式为${this.runFrameOptions[val].label}的文件,请上传后缀名为.bst的文件`);
          return false;
        } else if ((val === 3 || val === 4) && fileType !== '.zip') {
          this.$message.error(`模型格式为${this.runFrameOptions[val].label}的文件,请上传后缀名为.zip的文件`);
          return false;
        }
      }
      return true;
    },
    /** 模型文件上传信息 */
    getInfo(id, flag) {
      this.flag = flag;
      modelFileInfo(id).then(res => {
        if (res.code === '000000') {
          this.form = {
            id: res.data.id,
            modelFileName: res.data.modelFileName, // 模型文件名称
            modelFileType: res.data.modelFileType, // 模型文件格式
            fileId: res.data.fileId
          };
          this.modelFileList = [
            {
              name: res.data.fileName,
              url: res.data.fileUrl
            }
          ];
        }
      });
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.handleSelectFileType(this.form.modelFileType)) {
            saveModelFile(this.form).then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: '保存模型上传文件信息成功',
                  duration: 1000,
                  onClose: () => {
                    this.$emit('update:showDialog', false);
                    this.$emit('refreshDataList');
                  }
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .upload-model-file {
    margin-top: 16px;
    ::v-deep .el-upload {
      width: 80%;
    }
    ::v-deep .el-form-item__label {
      font-weight: 400;
    }
  }
</style>
