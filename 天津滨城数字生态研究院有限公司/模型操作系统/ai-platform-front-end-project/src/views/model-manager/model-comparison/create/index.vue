<template>
  <div class="create-task-container flex flex-direction bgc-main">
    <div class="create-task-title-container">
      <div class="margin-left-20 font-size-16 font-weight color-content">
        创建模型对比任务
      </div>
      <div class="flex margin-right-16">
        <el-button class="return-btn" icon="el-icon-caret-left" @click="returnModelBase">返回</el-button>
      </div>
    </div>
    <div class="flex flex-direction create-task-from-container">
      <el-row>
        <el-col :span="16">
          <el-form ref="ruleForm" :model="createFrom" :rules="rules" label-width="100px" label-suffix=":" @submit.native.prevent>
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="createFrom.taskName" maxlength="32" placeholder="输入任务名称" class="name-input" />
            </el-form-item>
            <el-form-item label="模型" label-width="100px" prop="selectedModel">
              <el-button class="select-button" @click="openSelectModelDialog">+选择模型</el-button>
              <div class="selectedModel-container">
                <div v-for="item of createFrom.selectedModel" :key="item.id">{{ item.modelNameCh }} {{ item.versionName }}</div>
              </div>
            </el-form-item>
            <el-form-item label="数据" label-width="100px" prop="selectedDataSet">
              <el-button class="select-button" @click="openUploadFileDialog">+选择数据</el-button>
              <div class="selectedDataSet-container">{{ createFrom.selectedDataSet&&createFrom.selectedDataSet.name }}</div>
            </el-form-item>
            <el-form-item v-show="createFrom.selectedModel.length >= 2" label="指标" label-width="100px" prop="indicator">
              <div class="property-container">
                性能指标
                <div class="flex">
                  <div>
                    <el-checkbox v-model="isPropertyCheckAll" :indeterminate="isPropertyIndeterminate" @change="changePropertyCheckAll">全选
                    </el-checkbox>
                  </div>
                  <el-checkbox-group v-model="createFrom.checkedProperty" @change="changeCheckedProperty">
                    <div class="margin-left-24 flex flex-wrap">
                      <div v-for="item in propertyList" :key="item.id" class="flex " style="width: 150px">
                        <el-checkbox :label="item.id">{{ item.indicatorName }}</el-checkbox>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="evaluate-container">
                评估指标
                <div class="flex">
                  <div>
                    <el-checkbox v-model="isEvaluateCheckAll" :indeterminate="isEvaluateIndeterminate" @change="changeEvaluateCheckAll">全选
                    </el-checkbox>
                  </div>
                  <el-checkbox-group v-model="createFrom.checkedEvaluate" @change="changeCheckedEvaluate">
                    <div class="margin-left-24 flex flex-wrap">
                      <div v-for="item in evaluateList" :key="item.id" class="flex checkBox-container">
                        <el-tooltip effect="dark" :content="item.indicatorName" placement="top-start">
                          <el-checkbox :label="item.id">{{ item.indicatorName }}</el-checkbox>
                        </el-tooltip>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
                <div class="tooltip-container">结构化数据,（回归预测模型\分类模型\时序预测模型）</div>
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
      :record-selected-data="createFrom.selectedDataSet"
      :is-show-tips="false"
      :form-web-type="'comparison'"
      @ok="uploadFileOk"
      @cancel="uploadFileCancel"
    />
    <select-model
      v-if="showSelectModelDialog"
      :record-selected-data="createFrom.selectedModel"
      :operate-type="'comparison'"
      @ok="selectModelOk"
      @cancel="selectModelCancel"
    />
  </div>
</template>

<script>
import { getModelIndicatorList, getModelPerformanceIndicatorList } from '@/api/model-indicator';
import { createTask } from '@/api/model-comparison';

import UploadFile from '@/components/UploadFile';
import SelectModel from '@/views/model-manager/model-evaluation/create-task/components/SelectModel';

export default {
  components: {
    SelectModel,
    UploadFile
  },
  data() {
    const validateIndicator = (rule, value, callback) => {
      if (this.createFrom.checkedProperty.length === 0 && this.createFrom.checkedEvaluate.length === 0) {
        if (this.createFrom.checkedProperty.length === 0) {
          callback(new Error('请选择指标'));
        } else if (this.createFrom.checkedEvaluate.length === 0) {
          callback(new Error('请选择指标'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      createFrom: {
        taskName: '',
        selectedDataSet: null,
        selectedModel: [],
        indicator: [],
        checkedProperty: [],
        checkedEvaluate: []
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        selectedModel: [
          { required: true, message: '请选择模型', trigger: 'change' }
        ],
        selectedDataSet: [
          { required: true, message: '请选择数据', trigger: 'change' }
        ],
        indicator: [
          { required: true, validator: validateIndicator, trigger: 'change' }
        ]
      },
      showUploadFileDialog: false,
      showSelectModelDialog: false,
      isPropertyCheckAll: false,
      propertyList: [],
      isPropertyIndeterminate: false,
      isEvaluateCheckAll: false,
      evaluateList: [],
      isEvaluateIndeterminate: false,
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
    // 打开数据选择弹框
    openUploadFileDialog() {
      this.showUploadFileDialog = true;
    },
    // 数据选择弹框-确定
    uploadFileOk(value) {
      this.createFrom.selectedDataSet = value;
      this.$refs.ruleForm.clearValidate('selectedDataSet');
      this.uploadFileCancel();
    },
    // 数据选择弹框-取消
    uploadFileCancel() {
      this.showUploadFileDialog = false;
    },
    // 打开模型选择弹框
    openSelectModelDialog() {
      this.showSelectModelDialog = true;
    },
    // 模型选择弹框-确定
    selectModelOk(value) {
      this.createFrom.selectedModel = value;
      this.$refs.ruleForm.clearValidate('selectedModel');
      this.handleLabelMapping(value[0]);
      this.getModelIndicatorList(value);
      this.selectModelCancel();
      this.getModelPerformanceIndicatorList();
    },
    handleLabelMapping(data) {
      if (this.categorySet.has(data.typeCode)) {
        let labelMapping = data.labelMapping.replace(/\'/g, '"');
        labelMapping = JSON.parse(labelMapping);
        const len = Object.keys(labelMapping).length;
        this.isMutiCategory = len > 2 ? 1 : 2;
      }
    },
    // 模型选择弹框-取消
    selectModelCancel() {
      this.showSelectModelDialog = false;
    },
    // 获取性能指标
    getModelPerformanceIndicatorList() {
      getModelPerformanceIndicatorList().then(res => {
        this.propertyList = res.data;
      });
    },
    // 性能指标全选样式控制
    changePropertyCheckAll(val) {
      this.createFrom.checkedProperty = val ? this.propertyList.map(item => { return item.id; }) : [];
      this.isPropertyIndeterminate = false;
    },
    // 勾选性能指标
    changeCheckedProperty(value) {
      const checkedCount = value.length;
      this.isPropertyCheckAll = checkedCount === this.propertyList.length;
      this.isPropertyIndeterminate = checkedCount > 0 && checkedCount < this.propertyList.length;
    },
    // 获取评估指标
    getModelIndicatorList(value) {
      const params = {
        modelTypeId: value[0].modelTypeId
      };
      if (this.categorySet.has(this.createFrom.selectedModel[0].typeCode)) {
        params['tag'] = this.isMutiCategory;
      }
      getModelIndicatorList(params).then(res => {
        this.evaluateList = res.data;
      });
    },
    // 评估指标全选样式控制
    changeEvaluateCheckAll(val) {
      this.createFrom.checkedEvaluate = val ? this.evaluateList.map(item => { return item.id; }) : [];
      this.isEvaluateIndeterminate = false;
    },
    // 勾选评估指标
    changeCheckedEvaluate(value) {
      const checkedCount = value.length;
      this.isEvaluateCheckAll = checkedCount === this.evaluateList.length;
      this.isEvaluateIndeterminate = checkedCount > 0 && checkedCount < this.evaluateList.length;
    },
    // 提交
    submit() {
      this.createLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            'dataId': this.createFrom.selectedDataSet.labelStudioProjectId,
            'indicatorIds': this.createFrom.checkedEvaluate,
            'jobName': this.createFrom.taskName,
            'modelIds': this.createFrom.selectedModel.map(item => { return item.id; }),
            'performanceIds': this.createFrom.checkedProperty
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
    // 返回
    returnModelBase() {
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
    min-height: 50px;
    background: #ffffff;
    min-width: var(--main-div-min-width);
  }
  .create-task-from-container {
    width: 80%;
    height: 100%;
    background: #FFFFFF;
    padding: 42px 56px;
    margin: 16px auto;
    box-shadow: 0 2px 6px 0 rgba(194,199,199,0.5);
    overflow: auto;
    min-width: var(--main-div-min-width);
    max-width: 1200px;
  }
  .name-input {
    width: 320px;
  }
  .select-button {
    width: 320px;
    height: 40px;
    background: #E4EDF8;
    border: 1px solid rgba(1,100,255,1);
    border-radius: 4px;
    color: #0164FF;
    &:hover {
      background: #E4EDF8;
    }
  }
  .selectedDataSet-container {
    display: inline-block;
    margin-left: 16px;
    font-size: 14px;
    color: #0164FF;
  }
  .selectedModel-container {
    font-size: 14px;
    color: #0164FF;
    margin-top: 8px;
  }
  .property-container {
    width: 100%;
    padding: 8px 24px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(153,163,175,0.5);
    border-radius: 1px;
  }
  .evaluate-container {
    width: 100%;
    padding: 8px 24px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(153,163,175,0.5);
    border-radius: 1px;
    margin-top: 4px;
    .tooltip-container {
      text-align: right;
      font-size: 14px;
      color: #B7B7B7;
      letter-spacing: 0;
      line-height: 14px;
      font-weight: 400;
      margin: 16px 0;
    }
  }
  ::v-deep .el-form {
    .el-form-item__label {
      font-weight: 400;
      color: #646464;
    }
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
