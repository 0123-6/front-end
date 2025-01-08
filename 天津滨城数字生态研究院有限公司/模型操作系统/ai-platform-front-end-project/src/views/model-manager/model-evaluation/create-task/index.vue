<template>
  <div class="create-task-container flex flex-direction bgc-main">
    <!--顶部数据-->
    <div class="create-task-title-container" style="min-width: 800px">
      <div class="margin-left-20 font-size-16 font-weight color-content">
        创建模型评估任务
      </div>
      <div class="flex margin-right-16">
        <el-button class="return-btn" icon="el-icon-caret-left" @click="returnModelEvaluation">返回</el-button>
      </div>
    </div>
    <div class="flex-direction create-task-from-container" style="min-width: 800px">
      <el-row>
        <el-col :span="16">
          <el-form
            ref="createForm"
            :model="createForm"
            :rules="rule"
            label-width="100px"
            label-suffix=":"
            @submit.native.prevent
          >
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="createForm.jobName" class="name-input" placeholder="输入任务名称" />
            </el-form-item>
            <el-form-item label="模型" label-width="100px" prop="selectModel">
              <el-button class="select-button" type="primary" @click="selectModel">+选择模型</el-button>
              <div v-if="createForm.selectModel" class="selectedDataSet-container">
                {{ createForm.selectModel.modelNameCh }} {{ createForm.selectModel.versionName }}
              </div>
            </el-form-item>
            <el-form-item label="数据" label-width="100px" prop="selectData">
              <el-button class="select-button" type="primary" @click="selectData">+选择数据</el-button>
              <div v-if="createForm.selectData" class="selectedDataSet-container">{{ createForm.selectData.name }}</div>
            </el-form-item>
            <el-form-item v-if="createForm.selectModel" label="指标" label-width="100px" prop="indicatorIds">
              <div class="property-container">
                <div class="flex">
                  <div v-if="propertyList.length !== 0">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
                    </el-checkbox>
                  </div>
                  <el-checkbox-group v-model="createForm.indicatorIds" @change="handleCheckedCitiesChange">
                    <div class="margin-left-24 flex flex-wrap">
                      <div v-for="city in propertyList" :key="city.id" class="flex checkBox-container">
                        <el-tooltip effect="dark" :content="city.indicatorName" placement="top-start">
                          <el-checkbox :label="city" :value="city.id">{{ city.indicatorName }}</el-checkbox>
                        </el-tooltip>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="blue-btn" :disabled="createLoading" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <upload-file
      v-if="showUploadFileDialog"
      :record-selected-data="createForm.selectData"
      :is-show-tips="false"
      :form-web-type="'evaluation'"
      @ok="uploadFileOk"
      @cancel="uploadFileCancel"
    />
    <select-model
      v-if="ShowSelectModelDialog"
      :operate-type="'evaluation'"
      :record-selected-data="[checkedModel]"
      @ok="selectModelOk"
      @cancel="selectModelCancel"
    />
  </div>
</template>

<script>
import SelectModel from '@/views/model-manager/model-evaluation/create-task/components/SelectModel';
import UploadFile from '@/components/UploadFile';
import { createTask } from '@/api/model-evaluation';
import { getModelIndicatorList } from '@/api/model-indicator';

export default {
  name: 'Index',
  components: {
    SelectModel,
    UploadFile
  },
  data() {
    return {
      createForm: {
        jobName: null,
        selectData: null,
        selectModel: null,
        indicatorIds: []// 指标
      },
      rule: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'change' },
          { min: 1, max: 32, message: '长度在 32 个字符以内', trigger: 'change' }
        ],
        selectData: [
          { required: true, message: '请选择数据', trigger: 'blur' }
        ],
        selectModel: [
          { required: true, message: '请输入模型', trigger: 'blur' }
        ],
        indicatorIds: [
          { required: true, message: '请选择指标', trigger: 'blur' }
        ]
      },
      showUploadFileDialog: false,
      ShowSelectModelDialog: false,
      checkAll: false,
      checkedData: null,
      checkedModel: null,
      checkedCities: [],
      propertyList: [],
      isIndeterminate: false,
      createLoading: false,
      isMutiCategory: null,
      categorySet: null,
      categoryList: ['ImageCategory', 'ClfModel', 'S-TextClassify'] // 二分类和多分类的类型
    };
  },
  mounted() {
    this.categorySet = new Set(this.categoryList);
  },
  methods: {
    selectData() {
      this.showUploadFileDialog = true;
    },
    selectModel() {
      this.ShowSelectModelDialog = true;
    },
    // 获取性能指标
    getModelIndicatorList(value) {
      const params = {
        modelTypeId: value.modelTypeId
      };
      if (this.categorySet.has(this.checkedModel.typeCode)) {
        params['tag'] = this.isMutiCategory;
      }
      getModelIndicatorList(params).then(res => {
        this.propertyList = res.data;
      });
    },
    handleCheckAllChange(val) {
      this.createForm.indicatorIds = val ? this.propertyList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.createForm.indicatorIds = value;
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.propertyList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.propertyList.length;
    },
    selectModelOk(data) {
      this.checkedModel = data;
      this.createForm.selectModel = data;
      this.checkAll = false;
      this.isIndeterminate = false;
      this.createForm.indicatorIds = [];
      this.handleLabelMapping(data);
      this.getModelIndicatorList(data);
      this.selectModelCancel();
    },
    handleLabelMapping(data) {
      if (this.categorySet.has(data.typeCode)) {
        let labelMapping = data.labelMapping.replace(/\'/g, '"');
        labelMapping = JSON.parse(labelMapping);
        const len = Object.keys(labelMapping).length;
        this.isMutiCategory = len > 2 ? 1 : 2;
      }
    },
    selectModelCancel() {
      this.ShowSelectModelDialog = false;
    },
    uploadFileOk(data) {
      this.createForm.selectData = data;
      this.uploadFileCancel();
    },
    uploadFileCancel() {
      this.showUploadFileDialog = false;
    },
    submit() {
      this.createLoading = true;
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          const params = {
            jobName: this.createForm.jobName,
            dataId: this.createForm.selectData.labelStudioProjectId,
            modelId: this.createForm.selectModel.id,
            indicatorIds: this.createForm.indicatorIds.map(item => item.id)// 指标
          };
          createTask(params).then(res => {
            if (res.code === '000000') {
              this.createLoading = false;
              this.$message({
                type: 'success',
                message: '创建任务成功!'
              });
              this.$router.back();
            } else {
              this.createLoading = false;
            }
          }).catch((err) => {
            this.createLoading = false;
            console.log(err);
          });
        } else {
          this.createLoading = false;
          return false;
        }
      });
    },
    returnModelEvaluation() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.create-task-container {
  width: 100%;
  height: calc(100vh - var(--header-height));

  .create-task-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    min-height: 40px;
    background: #ffffff;
    min-width: var(--main-div-min-width);
  }

  .create-task-from-container {
    display: flex;
    width: 80%;
    height: 100%;
    background: #FFFFFF;
    padding: 42px 56px;
    margin: 16px auto;
    box-shadow: 0 2px 6px 0 rgba(194,199,199,0.5);
    overflow-y: auto;
    min-width: var(--main-div-min-width);
    max-width: 1200px;
  }
  .selectedDataSet-container {
    display: inline-block;
    margin-left: 16px;
    font-size: 14px;
    color: #0164FF;
  }
  .name-input {
    width: 320px;
  }
  .select-button {
    width: 320px;
    height: 36px;
    background: #E4EDF8;
    border: 1px solid rgba(1,100,255,1);
    border-radius: 4px;
    color: #0164FF;
    &:hover {
      background: #E4EDF8;
    }
  }
  .property-container {
    width: 100%;
    padding: 8px 24px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(153,163,175,0.5);
  }

  ::v-deep {
    .checkBox-container{
      width: 150px;
      margin: 10px 0;
      .el-checkbox{
        display: flex;
        align-items: center;
      }
      .el-checkbox__label{
        width: 136px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
::v-deep{
  .create-task-from-container{
    label {
      font-weight: 400;
    }
  }
}
</style>
