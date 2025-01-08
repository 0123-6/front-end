<template>
  <!--最外层-->
  <div class="upload-file-dialog w-full flex flex-col pr-8 text-sm">
    <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="88px" label-suffix="：" class="mt-5">
      <div class="w-full flex flex-col">
        <!--上传文件-->
        <el-form-item label="上传文件" prop="fileUrl">
          <!--可以通过鼠标拖动到div上传,监听鼠标松开事件-->
          <div
            class="w-[490px] h-[153px] rounded-lg border relative border-dashed flex flex-col items-center cursor-pointer hover:border-main"
            :class="[
              !isEnter ? 'border-[#D8D8D8] bg-[#fbfbfb]' : 'border-main bg-[#e6f7fd]',
            ]">
            <!--浮层，解决drag问题-->
            <div class="absolute top-0 left-0 w-full h-full z-20" @click="uploadFile" @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" />
            <div v-show="!isEnter" class="flex flex-col items-center">
              <img src="../icon/FileSvg.svg" alt="" class="mt-6">
              <div class="mt-2 flex items-center text-sm leading-5">
                <span class="text-main">点击上传</span>
                <span class="text-[#000622]">或将文件拖拽到此处</span>
              </div>
              <span class="mt-2 text-black-three text-xs leading-[17px]">仅支持.pdf格式，大小在5M以内</span>
            </div>
            <div v-show="isEnter" class="w-full h-full flex flex-col justify-center items-center">
              <span class="text-sm text-main">释放鼠标</span>
            </div>
          </div>
          <!--文件上传状态展示-->
          <div v-if="uploadStatus" class="w-[490px] mt-[14px] h-[32px] flex">
            <!--左-->
            <img src="../icon/PdfSvg.svg" alt="">
            <!--右-->
            <div class="ml-2 flex-1 h-full flex flex-col justify-between items-start">
              <div class="w-full flex justify-between items-center">
                <!--左-->
                <span class="text-sm text-[#000622] leading-5 hpj-text-hidden">{{ fileName }}</span>
                <!--右-->
                <div class="ml-4 flex justify-center items-center text-[#BFBFBF] cursor-pointer hover:text-main"
                  @click="clearUploadFile">
                  <close-svg />
                </div>
              </div>
              <!--下面,进度条或文件大小或错误提示-->
              <div class="w-full flex flex-col">
                <!--进度条-->
                <div v-if="uploadStatus === 'uploading'" class="w-full h-[4px] rounded bg-[#E9E9E9] relative">
                  <div class="absolute top-0 left-0 h-full rounded" :class="[
                    uploadProgress > 0.999999999999 ? 'bg-[#68CD44]' : 'bg-main',
                  ]" style="transition: all 0.3s ease;" :style="{ width: uploadProgress * 100 + '%', }"></div>
                </div>
                <!--文件大小-->
                <span v-if="uploadStatus === 'uploadSuccess'" class="ddin-n text-sm text-[#B1B9BD]">{{ fileSize }}</span>
                <!--错误提示-->
                <span v-if="uploadStatus === 'uploadFalse'" class="text-sm text-red">上传失败</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <div class="w-full flex items-center">
          <!--发布时间-->
          <el-form-item label="发布时间" prop="publishTime">
            <el-date-picker v-model="form.publishTime" clearable type="date" placeholder="请选择日期" style="width: 193px;"
              value-format="YYYY-MM-DD" />
          </el-form-item>
          <!--生效时间-->
          <el-form-item label="生效时间" prop="effectTime" class="label-width-104">
            <el-date-picker v-model="form.effectTime" type="date" clearable placeholder="请选择日期" style="width: 193px;"
              value-format="YYYY-MM-DD" />
          </el-form-item>
        </div>
        <!--标签-->
        <el-form-item label="标签" prop="label">
          <el-cascader ref="cascader" v-model="form.label" :props="cascaderProps" :options="labelList" placeholder="请选择标签"
            clearable collapse-tags style="width: 100%;">
          </el-cascader>
        </el-form-item>
      </div>
    </el-form>
    <!--底部按钮-->
    <div class="mb-6 flex justify-end items-center">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" style="margin-left: 8px;" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import CloseSvg from "@/views/policy/components/icon/CloseSvg";
import { knowledgeBase_uploadFile } from "@/api/repository/knowledgeBase";
import request from "@/utils/request";
export default {
  name: "UploadFileDialog",
  components: { CloseSvg },
  props: {

  },
  data() {
    return {
      form: {
        // 上传文件返回的url
        fileUrl: '',
        // 发布时间
        publishTime: '',
        // 生效时间
        effectTime: '',
        // 标签
        label: null,
      },
      // 表单验证规则
      rules: {
        // 上传文件返回的url
        fileUrl: [
          { required: true, message: '请上传文件', trigger: 'change' },
        ],
        // 发布时间
        publishTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        // 生效时间
        effectTime: [
          // 生效时间必须大于发布时间
          {
            validator: (rule, value, callback) => {
              if (value && this.form.publishTime) {
                if (value < this.form.publishTime) {
                  callback(new Error('生效时间必须大于发布时间'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        // 标签
        label: [
          { required: true, message: '请输入标签', trigger: 'change' },
        ],
      },
      // 是否进入上传文件div
      isEnter: false,
      // 上传进度
      uploadProgress: 0,
      // 上传状态,未上传null，上传中uploading，上传成功uploadSuccess，上传失败uploadFalse
      uploadStatus: null,
      // timer
      timer: null,
      fileName: '',
      fileSize: '',
      labelList: [],
      cascaderProps: {
        multiple: true,
        value: 'id',
        label: 'name',
        emitPath: true,
        checkStrictly: false
      },
    };
  },
  created() {
    this.getLabelList();
  },
  methods: {
    async getLabelList() {
      const { result } = await request({
        url: '/pm/stepBaseinfo/getAllStepAndConditions',
        method: 'get',
      });
      console.log('result: ', result);
      this.labelList = result;
    },
    uploadFile() {
      // 创建一个input，然后点击，仅支持.pdf格式，大小在5M以内
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.click();
      input.onchange = () => {
        const file = input.files[0];
        this.dropFile(file);
        // 销毁input
        input.remove();
      };
    },
    async dropFile(file) {
      console.log('dropFile', file);
      // 必须是pdf格式
      if (file.type !== 'application/pdf') {
        this.$message.error('文件格式错误');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('请上传大小在5M以内的文件');
        return;
      }
      this.clearUploadFile(false);
      // 清除上传文件错误校验
      this.$refs.form.clearValidate('fileUrl');
      // 设置文件名称
      this.fileName = file.name;
      // 设置文件大小,如果大于1M，显示M，否则显示KB
      if (file.size > 1024 * 1024) {
        this.fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
      } else {
        this.fileSize = (file.size / 1024).toFixed(2) + 'KB';
      }
      // 设置定时器，模拟上传进度
      // this.timer = setInterval(() => {
      // 	if (this.uploadProgress >= 1) {
      // 		clearInterval(this.timer);
      // 		this.timer = null;
      // 		this.uploadStatus = 'uploadSuccess';
      // 		this.form.fileUrl = 'www.baidu.com/a.pdf';
      // 		// 重新校验
      // 		this.$refs.form.validateField('fileUrl');
      // 	} else {
      // 		this.uploadStatus = 'uploading';
      // 		this.uploadProgress = Math.min(1, this.uploadProgress + 0.1);
      // 	}
      // }, 1000);
      const formData = new FormData();
      formData.append('file', file);
      formData.bucketName = 'cip-repository';
      // 上传文件本身
      this.uploadStatus = 'uploading';
      const { result } = await knowledgeBase_uploadFile(formData);
      // 后续操作
      console.log('result: ', result);
      this.uploadProgress = 1;
      clearInterval(this.timer);
      this.timer = null;
      this.uploadStatus = 'uploadSuccess';
      this.form.fileUrl = result?.fileUrl;
      // 重新校验
      this.$refs.form.validateField('fileUrl');
    },
    handleDragOver(event) {
      // 阻止默认事件并添加样式
      console.log('into over');
      this.isEnter = true;
    },
    handleDragLeave(event) {
      console.log('into leave')
      this.isEnter = false;
    },
    handleDrop(event) {
      // 阻止默认事件、移除样式，并处理文件
      this.isEnter = false;
      this.dropFile(event.dataTransfer.files[0]);
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        console.log('getCheckedNodes', this.$refs.cascader.getCheckedNodes(true))
        if (valid) {
          const labelNodes = this.$refs.cascader.getCheckedNodes(true)
          const labelList = labelNodes.map(n => {
            const { id, code, name, type, parentId } = n.data
            return {
              labelId: id,
              labelCode: code,
              labelName: name,
              labelType: type,
              periodId: parentId,
            }
          })
          const params = {
            ...JSON.parse(JSON.stringify(this.form)),
            labelList,
          }
          // 删除params中的label
          delete params.label;
          this.$emit('on-ok', params);
        }
      });
    },
    onCancel() {
      this.$emit('on-cancel');
    },
    clearUploadFile(valid = true) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.fileName = '';
      // 设置上传状态为null
      this.uploadStatus = null;
      // 设置上传进度为0
      this.uploadProgress = 0;
      // 清空上传文件url
      this.form.fileUrl = '';
      this.fileSize = '';
      // 重新校验
      if (valid) {
        this.$refs.form.validateField('fileUrl');
      }
    },
  },
}
</script>

<style lang="scss">
.upload-file-dialog {
  .el-form-item--default .el-form-item__label {
    width: 114px !important;
  }

  .el-form--inline .el-form-item {
    margin-right: 0 !important;
  }

  .label-width-104 {
    .el-form-item__label {
      width: 104px !important;
    }
  }
}
</style>
