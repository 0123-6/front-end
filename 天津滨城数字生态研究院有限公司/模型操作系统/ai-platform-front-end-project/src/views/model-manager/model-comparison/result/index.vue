<template>
  <!--最外层-->
  <div class="flex flex-direction task-result-container">
    <div class="task-result-title-container">
      <div class="margin-left-20 font-size-16 font-weight color-content">
        查看对比结果
      </div>
      <div class="flex margin-right-16">
        <el-button icon="el-icon-caret-left" class="return-btn" @click="returnModelBase">返回</el-button>
      </div>
    </div>
    <div class="flex flex-direction task-result-from-container">
      <div
        class="flex flex-direction border-bottom margin-top-16 padding-bottom-8"
      >
        <div class="font-size-16 color-title" style="font-weight: 500">{{ jobName }}</div>
      </div>
      <!--数据集-->
      <div
        class="flex flex-direction margin-top-24"
        style="width: 100%"
      >
        <title-style title="数据集">
          <div class="flex color-blue font-size-14 hand" @click="toDetailPage">
            查看详情&gt;
          </div>
        </title-style>
        <div class="flex flex-wrap">
          <DetailCard :card-detail="dataSetDetail" />
        </div>
      </div>
      <el-divider />
      <!--指标-->
      <div>
        <title-style title="性能指标" />
        <el-table
          ref="performanceTable"
          v-loading="loading"
          :data="performanceData"
          border
          :class="{'note-data': performanceData.length === 0 }"
          @mousedown.native="performanceTableMouseDownHandler"
          @mouseup.native="performanceTableMouseUpHandler"
          @mousemove.native="performanceTableMouseMoveHandler"
          @sort-change="sortChange"
        >
          <el-table-column label="模型名称" prop="modelNameCh" show-overflow-tooltip min-width="150" />
          <el-table-column label="版本" prop="versionName" show-overflow-tooltip width="80" />
          <el-table-column
            label="运行总时长（ms）"
            prop="runtimeSum"
            sortable="custom"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            label="请求总次数"
            prop="requestNumSum"
            sortable="custom"
            show-overflow-tooltip
            min-width="130"
          />
          <el-table-column
            label="成功次数"
            prop="successNum"
            sortable="custom"
            show-overflow-tooltip
            min-width="110"
          />
          <el-table-column
            label="失败次数"
            prop="failNum"
            sortable="custom"
            show-overflow-tooltip
            min-width="110"
          />
          <el-table-column
            label="最大请求响应时间"
            prop="maxRuntime"
            sortable="custom"
            show-overflow-tooltip
            min-width="170"
          />
          <el-table-column
            label="最小请求响应时间"
            prop="minRuntime"
            sortable="custom"
            show-overflow-tooltip
            min-width="170"
          />
          <el-table-column
            label="平均请求响应时间"
            prop="avgRuntime"
            sortable="custom"
            show-overflow-tooltip
            min-width="170"
          />
        </el-table>
        <template v-if="evaluationData.length !== 0">
          <el-divider />
          <title-style title="评估指标" />
          <el-table
            ref="evaluationTable"
            v-loading="performanceLoading"
            :data="evaluationData"
            border
            :class="{'note-data': evaluationData.length === 0 }"
            @mousedown.native="evaluationTableMouseDownHandler"
            @mouseup.native="evaluationTableMouseUpHandler"
            @mousemove.native="evaluationTableMouseMoveHandler"
          >
            <el-table-column v-if="isAttributeEmpty" label="模型名称" prop="modelName" show-overflow-tooltip min-width="150" />
            <el-table-column v-if="isAttributeEmpty" label="版本" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column
              v-if="indexsObjectSet.has('Accuracy')"
              label="Accuracy"
              prop="Accuracy"
              sortable="custom"
              min-width="180"
            />
            <el-table-column
              v-if="macroPrecisson"
              label="Macro Precision"
              prop="Precision"
              sortable="custom"
              min-width="180"
            />
            <el-table-column
              v-if="macroRecall"
              label="Marco Recall"
              prop="Recall"
              sortable="custom"
              min-width="150"
            />
            <el-table-column
              v-if="macroF1Score"
              label="Marco F1-score"
              prop="F1Score"
              sortable="custom"
              min-width="150"
            />
            <el-table-column
              v-if="weightedPrecisson"
              label="Weighted Precision"
              prop="F1Score"
              sortable="custom"
              min-width="150"
            />
            <el-table-column
              v-if="weightedRecall"
              label="Weighted Recall"
              prop="F1Score"
              sortable="custom"
              min-width="150"
            />
            <el-table-column
              v-if="weightedF1Score"
              label="Weighted F1-score"
              prop="F1Score"
              sortable="custom"
              min-width="150"
            />
            <el-table-column v-if="indexsObjectSet.has('AUC')" label="AUC" prop="AUC" sortable="custom" min-width="150" />
            <el-table-column v-if="indexsObjectSet.has('mpa')" label="MPA" prop="mpa" min-width="80" />
            <el-table-column v-if="indexsObjectSet.has('mIOU')" label="MIOU" prop="mIOU" min-width="80" />
            <el-table-column v-if="indexsObjectSet.has('DICE')" label="DICE" prop="DICE" min-width="80" />
            <el-table-column v-if="indexsObjectSet.has('SA')" label="SA" prop="SA" min-width="80" />
          </el-table>
          <el-table
            v-if="indexsObjectSet.has('Precision') || indexsObjectSet.has('Recall') || indexsObjectSet.has('F1-score') || indexsObjectSet.has('Avg-Precision')"
            style="margin-top: 20px"
            :data="otherMetrics"
            :span-method="objectSpanMethod"
            border
            stripe
          >
            <el-table-column prop="id" label="类别" />
            <el-table-column prop="name" label="模型名称" />
            <el-table-column prop="versionName" label="版本" />
            <el-table-column v-if="indexsObjectSet.has('Precision')" prop="Precision" label="Precision" />
            <el-table-column v-if="indexsObjectSet.has('Recall')" prop="Recall" label="Recall" />
            <el-table-column v-if="indexsObjectSet.has('F1-score')" prop="F1Score" label="F1-score" />
            <el-table-column v-if="indexsObjectSet.has('Avg-Precision')" prop="AP" label="Average Precision" />
          </el-table>
        </template>
        <template v-if="IOUData.length !== 0">
          <el-divider />
          <title-style title="mAP" />
          <el-table
            ref="mAPTable"
            v-loading="performanceLoading"
            :data="IOUData"
            border
            :class="{'note-data': IOUData.length === 0 }"
            @mousedown.native="mAPTableMouseDownHandler"
            @mouseup.native="mAPTableMouseUpHandler"
            @mousemove.native="mAPTableMouseMoveHandler"
          >
            <el-table-column label="ID" prop="id" show-overflow-tooltip width="80" />
            <el-table-column label="模型名称" prop="modelName" show-overflow-tooltip min-width="100" />
            <el-table-column label="版本" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column v-if="IOU0Visiable" prop="IOU0" label="IOU >= 0.5mAP" min-width="100" />
            <el-table-column v-if="IOU1Visiable" prop="IOU1" label="IOU >= 0.75mAP" min-width="100" />
            <el-table-column v-if="IOU2Visiable" prop="IOU2" label="IOU >= 0.95mAP" min-width="100" />
          </el-table>
        </template>

        <div v-if="curveData.length !== 0">
          <div class="margin-top-24">
            <title-style title="ROC曲线" />
            <div id="roc1Id" class="flex" style="width: 500px;height: 500px; margin: 0 auto" />
          </div>
          <div class="margin-top-24 margin-bottom-24">
            <title-style title="P-R曲线" />
            <div id="roc2Id" class="flex" style="width: 500px;height: 500px; margin: 0 auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getModelLogList, getTaskResult } from '@/api/model-comparison';
import DetailCard from '@/views/model-manager/components/DetailCard';
import {
  IOUDataDict
} from '@/views/model-manager/model-evaluation/evaluation-result/evaluation-metrics.ts';
import { handleOption } from '@/views/model-manager/model-comparison/result/echarts-config';
export default {
  components: {
    TitleStyle: () => import('@/components/TitleStyle'),
    DetailCard
  },
  data() {
    return {
      dataSetDetail: {},
      performanceLoading: false,
      performanceData: [],
      loading: false,
      jobName: '',
      evaluationData: [],
      performanceTableMouseFlag: false,
      performanceTableMouseOffset: 0,
      evaluationTableMouseFlag: false,
      evaluationTableMouseOffset: 0,
      mAPTableMouseFlag: false,
      mAPTableMouseOffset: 0,
      dataSetFrom: '',
      IOUData: [],
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式
      IOUColumnLength: 0,
      modelType: '',
      IOU0Visiable: false, // 控制列的显示
      IOU1Visiable: false, // 控制列的显示
      IOU2Visiable: false, // 控制列的显示
      AP: false,
      Accuracy: false,
      AUC: false,
      MPA: false,
      DICE: false,
      SA: false,
      MIOU: false,
      MSE: false,
      MAE: false,
      R2: false,
      RMSE: false,
      macroPrecisson: false,
      macroRecall: false,
      macroF1Score: false,
      weightedPrecisson: false,
      weightedRecall: false,
      weightedF1Score: false,
      otherMetrics: [],
      curveData: [],
      isAttributeEmpty: false, // 对比指标是否全为空
      itemNum: 0, // 对比的模型数量
      indexsObjectSet: null,
      categoryList: ['ImageCategory', 'ClfModel', 'S-TextClassify'] // 二分类和多分类的类型
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getTaskResult();
      this.getPerformanceData();
      this.initECharts();
    },
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    performanceTableMouseDownHandler(e) {
      this.performanceTableMouseOffset = e.clientX;
      this.performanceTableMouseFlag = true;
    },
    performanceTableMouseUpHandler(e) {
      this.performanceTableMouseFlag = false;
    },
    performanceTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.performanceTable) return;
      const divData = this.$refs.performanceTable.bodyWrapper;
      if (this.performanceTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.performanceTableMouseOffset + (this.performanceTableMouseOffset = e.clientX));
      }
    },
    // 按下鼠标记录鼠标位置
    evaluationTableMouseDownHandler(e) {
      this.evaluationTableMouseOffset = e.clientX;
      this.evaluationTableMouseFlag = true;
    },
    evaluationTableMouseUpHandler(e) {
      this.evaluationTableMouseFlag = false;
    },
    evaluationTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.evaluationTable) return;
      const divData = this.$refs.evaluationTable.bodyWrapper;
      if (this.evaluationTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.evaluationTableMouseOffset + (this.evaluationTableMouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mAPTableMouseDownHandler(e) {
      this.mAPTableMouseOffset = e.clientX;
      this.mAPTableMouseFlag = true;
    },
    mAPTableMouseUpHandler(e) {
      this.mAPTableMouseFlag = false;
    },
    mAPTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.mAPTable) return;
      const divData = this.$refs.mAPTable.bodyWrapper;
      if (this.mAPTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mAPTableMouseOffset + (this.mAPTableMouseOffset = e.clientX));
      }
    },
    returnModelBase() {
      this.$router.push({ path: '/model-manager/comparison/list' });
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.getTaskResult();
    },
    // 获取数据集
    async getTaskResult() {
      const params = {
        'id': this.$route.params.id,
        column: this.sortColumn,
        order: this.sortOrder
      };
      this.performanceLoading = true;
      await getTaskResult(params).then(res => {
        if (res.code === '000000') {
          this.jobName = res.data.jobName;
          this.dataSetDetail = res.data.aiDataSet || {};
          this.dataSetFrom = res.data.aiDataSet?.table;
          this.evaluationData = [];
          this.IOUData = [];
          this.IOUColumnLength = 0;
          const { indexsObject } = res.data.evaluationJobResults[0];
          this.indexsObjectSet = new Set(indexsObject);
          this.itemNum = res.data.evaluationJobResults.length;
          res.data.evaluationJobResults.map(item => {
            const data = item.dataObject;
            // data = JSON.parse(data);
            this.modelType = item.modelType;
            if (data && data.IOU && indexsObject) {
              const obj = {
                'id': item.id,
                'modelName': item.modelName,
                'versionName': item.model.version.versionName
              };
              // this.IOUColumnLength = data.IOU.length;
              this.IOUColumnLength = indexsObject.length;
              indexsObject.forEach(ele => {
                data.IOU.forEach((item, index) => {
                  if (Number(ele) === item.IOU) {
                    // obj[`IOU${index}`] = item.IOU + '/' + item.mAP;
                    obj[`IOU${index}`] = item.mAP;
                    obj[`label${index}`] = IOUDataDict[item.IOU];
                  }
                });
              });
              this.IOU0Visiable = obj.hasOwnProperty('IOU0');
              this.IOU1Visiable = obj.hasOwnProperty('IOU1');
              this.IOU2Visiable = obj.hasOwnProperty('IOU2');
              this.IOUData.push(obj);
            }
            const { AP, AUC, Accuracy, mpa, mIOU, SA, DICE, MIoU, MSE, MAE, R2, RMSE,
              curve,
              classificationReport,
              AP_0,
              AP_1,
              Precision_0,
              Precision_1,
              Recall_0,
              Recall_1 } = data;
            const F1Score_0 = data['F1-score_0'];
            const F1Score_1 = data['F1-score_1'];
            let macroPrecisson, macroRecall, macroF1Score, weightedPrecisson, weightedRecall, weightedF1Score;
            if (classificationReport) {
              const macroAvg = classificationReport && classificationReport['macro avg'];
              const weightedAvg = classificationReport && classificationReport['weighted avg'];
              macroPrecisson = macroAvg['precison'];
              macroRecall = macroAvg['recall'];
              macroF1Score = macroAvg['f1-score'];
              weightedPrecisson = weightedAvg['precison'];
              weightedRecall = weightedAvg['recall'];
              weightedF1Score = weightedAvg['f1-score'];
            }
            if (this.modelType === 'TextEntityExtraction') {
              const macroAvg = data['macro avg'];
              const weightedAvg = data['weighted avg'];
              macroPrecisson = macroAvg['precison'];
              macroRecall = macroAvg['recall'];
              macroF1Score = macroAvg['f1-score'];
              weightedPrecisson = weightedAvg['precison'];
              weightedRecall = weightedAvg['recall'];
              weightedF1Score = weightedAvg['f1-score'];
            }
            const Metrics = { AP, Accuracy, AUC, mpa, mIOU, SA, MIoU, MSE, MAE, R2, RMSE, DICE,
              macroPrecisson, macroRecall, macroF1Score, weightedPrecisson, weightedRecall, weightedF1Score };
            const Metrics_0 = {
              id: 0,
              name: item.modelName,
              versionName: item?.model.version.versionName,
              Precision: Precision_0,
              Recall: Recall_0,
              F1Score: F1Score_0,
              AP: AP_0
            };
            const Metrics_1 = {
              id: 1,
              name: item.modelName,
              versionName: item?.model.version.versionName,
              Precision: Precision_1,
              Recall: Recall_1,
              F1Score: F1Score_1,
              AP: AP_1
            };
            this.otherMetrics.push(Metrics_0);
            this.otherMetrics.push(Metrics_1);
            this.macroPrecisson = !!macroPrecisson;
            this.macroRecall = !!macroRecall;
            this.macroF1Score = !!macroF1Score;
            this.weightedPrecisson = !!weightedPrecisson;
            this.weightedRecall = !!weightedRecall;
            this.weightedF1Score = !!weightedF1Score;
            this.isAttributeEmpty = this.isObjectEmpty(Metrics);
            const Obj = {
              'modelName': item.modelName,
              'versionName': item?.model.version.versionName,
              ...Metrics
            };
            if (curve) {
              this.curveData.push(curve);
            }
            this.evaluationData.push(Obj);
          });
          this.otherMetrics = this.swapArr(this.otherMetrics, 1, 2);
          this.performanceLoading = false;
        } else {
          this.jobName = '';
          this.dataSetFrom = '';
          this.evaluationData = [];
          this.performanceLoading = false;
        }
      }).catch(() => {
        this.jobName = '';
        this.dataSetFrom = '';
        this.evaluationData = [];
        this.performanceLoading = false;
      });
    },
    // 获取性能指标
    getPerformanceData() {
      this.loading = true;
      const params = {
        'modelEvaluationComparisonJobId': this.$route.params.id
      };
      getModelLogList(params).then(res => {
        if (res.code === '000000') {
          this.performanceData = res.data;
          this.loading = false;
        } else {
          this.performanceData = [];
          this.loading = false;
        }
      }).catch(() => {
        this.performanceData = [];
        this.loading = false;
      });
    },
    toDetailPage() {
      if (this.dataSetFrom === 'project') {
        sessionStorage.setItem('isShowLabelView', true);
        sessionStorage.setItem('isShowForkButton', false);
        const { href } = this.$router.resolve({
          // path: `/data-manager/dataSet/mine-detail/blank/${this.dataSetDetail.id}`
          path: `/data-manager/data-set/common-detail/blank/${this.dataSetDetail.id}/mine`
        });
        window.open(href, '_blank');
      } else {
        sessionStorage.setItem('isShowLabelView', true);
        sessionStorage.setItem('isShowForkButton', false);
        const { href } = this.$router.resolve({
          path: `/data-manager/data-set/common-detail/blank/${this.dataSetDetail.id}/common`
        });
        window.open(href, '_blank');
      }
    },

    swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    isObjectEmpty(ObjectValue) {
      for (const key in ObjectValue) {
        if (ObjectValue.hasOwnProperty(key)) {
          return ObjectValue[key] === undefined;
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % this.itemNum === 0) {
          return {
            rowspan: this.itemNum,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    initECharts() {
      if (this.curveData.length !== 0) {
        const roc1 = this.$echarts.init(document.getElementById('roc1Id'));
        const roc1Config = handleOption(this.curveData[0][0], this.curveData[1][0]);
        // 绘制图表
        roc1.setOption(roc1Config);
        const roc2 = this.$echarts.init(document.getElementById('roc2Id'));
        const roc2Config = handleOption(this.curveData[1][0], this.curveData[1][1]);
        // 绘制图表
        roc2.setOption(roc2Config);
      }
    },
    headerStyle({ row, column, rowIndex, columnIndex }) {
      row[3].colSpan = this.IOUColumnLength;
      if (columnIndex >= 4) {
        row[columnIndex].colSpan = 0;
        return 'display: none';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.task-result-container {
  width: 100%;
  min-height: calc(100vh - var(--header-height));
  min-width: 1200px;
  .task-result-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    min-height: 50px;
    background: #ffffff;
  }
  .task-result-from-container {
    width: 90%;
    overflow: auto;
    // min-height: 80vh;
    // min-height: calc(100vh + 24px);
    background: #ffffff;
    padding: 24px 56px;
    margin: 16px auto;
    box-shadow: 0 2px 6px 0 rgba(194,199,199,0.5);
    border-radius: 1px;
    height: 100vh;
  }
  .el-table {
    &.note-data {
      border-bottom: 1px solid #EBEEF5;
    }
    ::v-deep .el-table__header-wrapper {
      // border-radius: 4px 4px 0px 0px;
      .el-table__header {
        th {
          background: #f8f8f9;
          padding: 6px;
        }
      }
    }
    ::v-deep .el-table__body-wrapper {
      tr > td {
        height: 45px;
        line-height: 45px;
        padding: 4px 8px;
        word-break: break-all;
        background: #ffffff;
      }
    }
    ::v-deep .el-table__empty-block {
      background: #ffffff;
    }
  }
  .el-divider {
    background-color: rgba(238,238,238,1);;
  }
  ::v-deep .el-table--group, .el-table--border {
    &::after {
      width: 1px !important;
    }
  }
}
</style>
