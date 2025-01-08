<template>
  <!--最外层-->
  <div id="box" class="flex flex-direction bgc-main my-1" style="width: 100%;height: 100%;">
    <!--上-->
    <div
      class="flex bgc-white justify-between align-center box-shadow-1"
      style="width: 100%;height: 50px;min-height: 50px;position: sticky;top: 0;z-index: 15;"
    >
      <div class="flex font-size-16 color-content font-weight" style="margin-left: 20px;">
        创建模型
      </div>
      <div class="flex justify-end" v-if="preRoute === 'modelPush'">
        <el-button class="return-btn" icon="el-icon-caret-left" style="margin-right: 20px;" @click="goHome">返回</el-button>
      </div>
    </div>
    <!--主体-->
    <div
      v-loading="loading"
      class="flex flex-direction bgc-main align-center"
      style="min-width: 100%;width: max-content;"
    >
      <!--内容区-->
      <div
        class="flex flex-direction bgc-white margin-top-16 margin-bottom-16 box-shadow-1"
        style="padding-left: 56px;padding-right: 56px;width: calc(100% - 436px);min-width: var(--main-div-min-width);max-width: 1200px;"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="84px"
          label-suffix=":"
          style="margin-top: 24px;width: 686px;"
        >
          <el-form-item label="模型文件" prop="modelFileId">
            <el-button
              plain
              type="primary"
              icon="el-icon-plus"
              style="width: 46%"
              @click="showDialog = true"
            >添加
            </el-button>
            <el-link v-if="form.modelFileName !== ''" class="model-file-name" type="primary" :underline="false">{{
              form.modelFileName
            }}
            </el-link>
          </el-form-item>
          <el-form-item label="模型格式">
            <el-input
              v-model="form.modelFileType"
              :disabled="true"
              placeholder="请选择模型格式"
              clearable
              style="width: 46%"
            />
          </el-form-item>
          <el-form-item label="模型名称" prop="modelNameCh">
            <el-row type="flex">
              <el-col :span="11">
                <el-input v-model="form.modelNameCh" placeholder="请输入模型名称(中文)" clearable />
              </el-col>
              <el-col :span="2" />

              <el-col :span="11">
                <el-input v-model="form.modelNameEn" placeholder="请输入模型名称(英文)" clearable />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="模型封面" prop="coverUrl">
            <el-upload
              class="avatar-uploader"
              :action="actionUrl"
              :data="{
                type: '1'
              }"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.bmp"
            >
              <img
                v-if="form.coverUrl!==undefined && form.coverUrl!=null && form.coverUrl!==''"
                :src="form.coverUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="flex font-size-12 color-title-2">
              图片文件类型支持PNG、JPG、JPEG、BMP，图片大小不超过2M。
            </div>
          </el-form-item>
          <el-form-item label="使用场景" prop="modelScenesId">
            <el-select
              v-model="form.modelScenesId"
              placeholder="请选择使用场景"
              clearable
              style="width: 46%"
              @change="handleScenesInfo"
            >
              <el-option
                v-for="item in scenesList"
                :key="item.id"
                :label="item.scenesName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模型类型" prop="modelTypeId">
            <el-select
              v-model="form.modelTypeId"
              placeholder="请选择模型类型"
              clearable
              style="width: 46%"
              @change="handleModelType"
            >
              <el-option
                v-for="item in modelTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标签映射">
            <div class="flex flex-direction color-content" style="width: 500px;">
              <div v-for="(item,index) in form.labelMapping" :key="index" class="flex align-center">
                <span class="flex padding-8">键：<el-input v-model="item.key" /></span>
                <span class="flex padding-8">值：<el-input v-model="item.value" /></span>
                <span class="hand" @click="deleteLabelMapping(index)"><i class="el-icon-delete" /></span>
              </div>
              <div class="flex" style="width: 100%;">
                <el-button type="" @click="addBabelMap"><i class="el-icon-circle-plus-outline" />添加标签映射</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="版本信息" prop="modelVersionId">
            <el-select
              v-model="form.modelVersionId"
              filterable
              allow-create
              default-first-optionplaceholder="请选择模型类型"

              clearable
              style="width: 46%"
              @change="handleModelName"
            >
              <el-option
                v-for="item in modelVersionList"
                :key="item.id"
                :label="item.versionName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模型简介" prop="modelShortDescribe">
            <el-input
              v-model="form.modelShortDescribe"
              type="textarea"
              placeholder="请输入模型简介"
              :rows="5"
              maxlength="500"
              show-word-limit
              style="border-radius: 4px;"
              class="border-radius-4"
            />
          </el-form-item>
          <el-form-item label="模型描述" prop="modelDescribe">
            <markdown-editor v-model="form.modelDescribe" :is-edit="true" />
          </el-form-item>
          <el-form-item>
            <el-button style="border-radius: 4px;" @click="handlePreviewModel">预览</el-button>
            <el-button
              v-if="$route.params.mode !== '2'"
              style="border-radius: 4px;"
              type="primary"
              @click="submitModelForm()"
            >
              创建
            </el-button>
            <el-button
              v-if="$route.params.mode === '2'"
              type="primary"
              style="border-radius: 4px;"
              :disabled="form.status==='ON_LINE' || form.status==='UNDER_DEVELOYMENT'"
              @click="submitModelForm()"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--新增、修改弹窗-->
    <el-dialog
      v-if="showDialog"
      v-dialogDrag
      visible
      append-to-body
      :custom-class="'upload-file-dialog'"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="'选择模型文件'"
      :before-close="() => { showDialog = false }"
    >
      <select-model-file ref="selectModelFile" :show-dialog.sync="showDialog" @refreshDataList="getModelFile" />
    </el-dialog>
  </div>
</template>

<script>
import {
  modelFileInfo,
  modelScenesList,
  modelTypeList,
  modelVersionList,
  createModel,
  updateModel,
  previewModel
} from '@/api/model.js';
import selectModelFile from '@/views/develop/components/select-model-file.vue';

export default {
  name: 'CreateModel',
  components: {
    selectModelFile
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      actionUrl: process.env.NODE_ENV === 'development' ? '/api/backend/file?signature=AppWeb00123' : '/backend/file?signature=AppWeb00123',
      scenesList: [],
      modelTypeList: [],
      modelVersionList: [],
      runFrameOptions: [
        { value: 'SKLEARN', label: 'SKLEARN' },
        { value: 'XGBOOST', label: 'XGBOOST' },
        { value: 'LIGHTGBM', label: 'LIGHTGBM' },
        { value: 'TENSORFLOW', label: 'TENSORFLOW' },
        { value: 'PYTORCH', label: 'PYTORCH' }
      ],
      form: {
        id: '', // 修改模型时用，表示我的模型的id(与模型文件id不一样，为2个不同的属性)
        modelFileId: '', // 模型文件id
        modelFileName: '', // 模型文件名称
        modelFileType: '', // 模型文件格式
        modelNameCh: '', // 模型中文名称
        modelNameEn: '', // 模型英文名称
        coverUrl: '', // 模型封面
        cover: '', // 模型封面id
        modelScenesId: '', // 模型场景id
        scenesName: '', // 场景名称
        modelTypeId: '', // 模型类型id
        modelTypeName: '', // 类型名称
        modelVersionId: '', // 模型版本id
        versionName: '', // 模型版本
        modelShortDescribe: '', // 模型简介
        modelDescribe: '', // 模型描述,
        labelMapping: []// 标签映射
      },
      // modelFileType: [
      //   {
      //     required: true,
      //     message: '请选择模型文件格式',
      //     trigger: 'blur'
      //   }
      // ],
      rules: {
        modelFileId: [
          {
            required: true,
            message: '模型文件信息不能为空',
            trigger: 'change'
          }
        ],
        modelNameCh: [
          {
            required: true,
            message: '模型名称不能为空',
            trigger: 'blur'
          },
          {
            message: '模型名称不能超过30个字',
            trigger: 'blur',
            max: 30
          }
        ],
        modelShortDescribe: [
          {
            required: true,
            message: '模型简介不能为空',
            trigger: 'blur'
          }
        ],
        coverUrl: [
          {
            required: true,
            message: '请上传模型图标',
            trigger: 'change'
          }
        ],
        modelScenesId: [
          {
            required: true,
            message: '请选择模型场景',
            trigger: 'change'
          }
        ],
        modelTypeId: [
          {
            required: true,
            message: '请选择模型类型',
            trigger: 'change'
          }
        ],
        modelVersionId: [
          {
            required: true,
            message: '请选择模型版本信息',
            trigger: 'change'
          }
        ]
      },
      preRoute: ''
    };
  },
  computed: {
    modelTypeDisabled() {
      return this.form.modelFileId !== undefined && this.form.modelFileId != null && this.form.modelFileId !== '';
    }
  },
  watch: {},
  created() {
    // this.loading = true
    console.log(222222, this.$route.params.mode);
    // 直接进去
    if (this.$route.params.mode == ':mode') {
      console.log('直接进去');
      this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      if (this.form.id != '') { // 修改模型留下的
        this.$store.commit('SET_PREVIRE_CLEAR');
        this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      }
      console.log('this.form', this.form);
      this.loading = false;
    } else if (this.$route.params.mode == '1') { // 通过模型文件，创建模型进去
      console.log('通过模型文件进去');
      this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      if (this.form.id != '') { // 修改模型留下的
        this.$store.commit('SET_PREVIRE_CLEAR');
        this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      }
      console.log('this.form', this.form);
      console.log('this.$route.params.id:', this.$route.params.id);
      if (this.form.modelFileId != this.$route.params.id) {
        console.log('this.form.modelFileId!=this.$route.params.id true');
        this.$store.commit('SET_PREVIRE_CLEAR');
        this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      }
      this.getModelFile(this.$route.params.id);
    } else if (this.$route.params.mode == '2') { // 通过我的模型，查看进去
      console.log('通过我的模型，查看进去');
      // 判断vuex中模型id与传入的待修改模型id是否一致，一致的话用vuex的值，否则根据传入的id查
      this.form = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
      if (this.form.id != this.$route.params.id) {
        this.previewModel();
      } else {
        this.loading = false;
      }
    }
    this.getScenesList();
    this.getModelTypeList();
    this.getModelVersionList();
  },
  mounted() {
    // 处理markdown存在文字会聚焦，导致滚动条滚动到markdown位置的情况
    setTimeout(() => {
      document.getElementById('layout-container').scrollTop = 0;
    }, 0);
    this.preRoute = sessionStorage.getItem('preRoute');
  },
  beforeDestroy() {
    console.log('进入创建模型销毁组件方法 into beforeDestory,form=', this.form);
    this.$store.commit('SET_PREVIEW_INFO', this.form);
  },
  methods: {
    goHome() {
      // this.$router.push('/')
      // this.$router.back();
      if (this.preRoute === 'modelPush') {
        this.$router.push('/model-manager/push/list');
        this.$store.commit('modelPush/CLEAR_HEIGHT', { height: false });
      }
    },
    // 添加标签映射
    addBabelMap() {
      this.form.labelMapping.push({
        key: '',
        value: ''
      });
    },
    deleteLabelMapping(index) {
      this.form.labelMapping.splice(index, 1);
    },
    handleModelName(val) {
      this.modelVersionList.forEach(item => {
        if (item.id === val) {
          this.form.versionName = item.versionName;
        }
      });
    },
    previewModel() {
      previewModel(this.$route.params.id).then(res => {
        this.form = res.data;
        // 将labelMapping修改为数组格式
        let labelMapping = null;// labelMapping为null
        labelMapping = JSON.parse(this.form.labelMapping);// 现在为对象
        this.form.labelMapping = [];
        for (const key in labelMapping) {
          this.form.labelMapping.push({
            key,
            value: labelMapping[key]
          });
        }
        this.loading = false;
      });
    },
    handleScenesInfo(val) {
      this.scenesList.forEach(item => {
        if (item.id === val) {
          this.form.scenesName = item.scenesName;
        }
      });
    },
    handleModelType(val) {
      this.modelTypeList.forEach(item => {
        if (item.id === val) {
          this.form.modelTypeName = item.typeName;
        }
      });
    },
    /** 获取模型场景列表信息 */
    getScenesList() {
      modelScenesList().then(res => {
        if (res.code === '000000') {
          this.scenesList = res.data;
        }
      });
    },
    /** 获取模型类别列表信息 */
    getModelTypeList() {
      modelTypeList().then(res => {
        if (res.code === '000000') {
          this.modelTypeList = res.data;
        }
      });
    },
    /** 获取模型版本信息 */
    getModelVersionList() {
      modelVersionList().then(res => {
        if (res.code === '000000') {
          this.modelVersionList = res.data;
        }
      });
    },
    /** 获取模型文件信息 */
    getModelFile(id) {
      modelFileInfo(id).then(res => {
        if (res.code === '000000') {
          console.log('开始设置模型的id和type，type将禁止选择，res：', res);
          this.form.modelFileType = res.data.modelFileType;
          this.form.modelFileId = res.data.id;
          this.form.modelFileName = res.data.modelFileName;
          this.loading = false;
        }
      });
    },
    /** 上传模型格式校验 */
    beforeUpload(file) {
      console.log('into 上传校验');
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG,JPEG,PNG,BMP 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      console.log('上传校验结束，结果：', isJPG && isLt2M);
      return isJPG && isLt2M;
    },
    /** 模型上传成功 */
    handleUploadSuccess(res, file) {
      console.log('图片上传成功:', res);
      if (res.code === '000000') {
        this.form.cover = res.data[0].id;
        this.form.coverUrl = res.data[0].url;
      }
    },
    /** 创建或者修改模型信息 */
    submitModelForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));
          const labelMapping = {};
          for (let i = 0; i < params.labelMapping.length; i++) {
            const item = params.labelMapping[i];
            labelMapping[item.key] = item.value;
          }
          params.labelMapping = JSON.stringify(labelMapping);
          if (this.$route.params.mode === '2') { // 修改操作
            updateModel(params).then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: '修改模型信息成功',
                  duration: 500,
                  onClose: () => {
                    this.preRoute = sessionStorage.getItem('preRoute');
                    if (this.preRoute === 'modelDevelop') {
                      this.$router.push({ path: '/model/mine-model' });
                    } else if (this.preRoute === 'modelPush') {
                      this.$router.push({ path: '/model-manager/push/list' });
                    }
                  }
                });
                this.$store.commit('SET_PREVIRE_CLEAR');
              }
            });
          } else { // 新增操作
            createModel(params).then(res => {
              if (res.code === '000000') {
                // 表单提交操作
                this.$message({
                  type: 'success',
                  message: '创建模型信息成功',
                  duration: 500,
                  onClose: () => {
                    // 创建成功不保存数据
                    this.form = {
                      id: '', // 修改模型时用，表示我的模型的id(与模型文件id不一样，为2个不同的属性)
                      modelFileId: '', // 模型文件id
                      modelFileName: '', // 模型文件名称
                      modelFileType: '', // 模型文件格式
                      modelNameCh: '', // 模型中文名称
                      modelNameEn: '', // 模型英文名称
                      coverUrl: '', // 模型封面
                      cover: '', // 模型封面id
                      modelScenesId: '', // 模型场景id
                      scenesName: '', // 场景名称
                      modelTypeId: '', // 模型类型id
                      modelTypeName: '', // 类型名称
                      modelVersionId: '', // 模型版本id
                      versionName: '', // 模型版本
                      modelShortDescribe: '', // 模型简介
                      modelDescribe: '', // 模型描述,
                      labelMapping: []// 标签映射
                    };
                    this.$refs['form'].resetFields();
                    this.$store.commit('SET_PREVIRE_CLEAR');
                    this.preRoute = sessionStorage.getItem('preRoute');
                    if (this.preRoute === 'modelDevelop') {
                      this.$router.push({ path: '/model/mine-model' });
                    } else if (this.preRoute === 'modelPush') {
                      this.$router.push({ path: '/model-manager/push/list' });
                    } else {
                      // 直接进入和模型文件进入
                      this.$router.push({ path: '/model/mine-model' });
                    }
                  }
                });
              }
            });
          }
        }
      });
    },
    /** 预览模型文件 */
    handlePreviewModel() {
      console.log('进入创建模型销毁组件方法 into beforeDestory,form=', this.form);
      this.$store.commit('SET_PREVIEW_INFO', this.form);
      this.form.updateTime = this.dateFormat('Y-m-d H:M:S', new Date());
      sessionStorage.setItem('preRoute', 'createModel');
      this.$router.push('/model/create-model/preview/99999999');
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        's': date.getMilliseconds() // 毫秒
      };
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
        }
      }
      return fmt;
    }

  }
};
</script>

<style lang="scss" scoped>
.model-file-name {
  padding-left: 10px;
}

.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 196px;
    height: 74px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .avatar {
    width: 196px;
    height: 74px;
    display: block;
  }
}
.my-1 {
  ::v-deep {
    label {
      font-weight: 400 !important;
    }
    .el-textarea__inner {
      border-radius: 4px;
    }
  }
}
::v-deep .upload-file-dialog {
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
    padding: 0;
    padding-bottom: 24px;
  }
}
::v-deep{
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
