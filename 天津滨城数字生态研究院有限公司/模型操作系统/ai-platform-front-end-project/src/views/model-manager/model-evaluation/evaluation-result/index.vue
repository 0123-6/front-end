<template>
  <!--最外层-->
  <div class="wrapper">
    <!--顶部数据-->
    <div class="crumbs">
      <div>查看评估结果</div>
      <el-button class="return-btn" icon="el-icon-caret-left" @click="returnModelBase">返回</el-button>
    </div>
    <div class="content">
      <div class="info">
        <div v-if="info.modelNameCh" class="main-title">{{ info.modelNameCh }}</div>
        <div class="sub-title">
          <div v-if="info.versionName">版本 ：{{ info.versionName }}</div>
          <div v-if="info.createName">创建者： {{ info.createName }}</div>
          <div v-if="info.createTime">创建时间： {{ info.createTime }}</div>
        </div>
      </div>
      <!--数据集-->
      <div class="data-set">
        <div class="flex justify-between" style="color:#0164FF;font-size: 14px;">
          <title-style title="数据集" />
          <a @click="toDetailPage">查看详情 ></a>
        </div>
        <div class="flex flex-wrap">
          <DetailCard :card-detail="dataSetDetail" />
        </div>
      </div>
      <!--详细评估-->
      <div class="flex flex-direction margin-top-8">
        <div v-if="evaluationTargets.length !== 0">
          <title-style title="详细评估" />
          <el-table :data="evaluationTargets" border stripe>
            <el-table-column prop="title" label="评估指标" />
            <el-table-column prop="result" label="效果" />
          </el-table>
          <el-table
            v-if="indexsObjectSet.has('Precision') || indexsObjectSet.has('Recall') || indexsObjectSet.has('F1-score') || indexsObjectSet.has('Avg-Precision')"
            style="margin-top: 20px"
            :data="otherMetrics"
            border
            stripe
          >
            <el-table-column c prop="id" label="类别" />
            <el-table-column v-if="indexsObjectSet.has('Precision')" prop="Precision" label="Precision" />
            <el-table-column v-if="indexsObjectSet.has('Recall')" prop="Recall" label="Recall" />
            <el-table-column v-if="indexsObjectSet.has('F1-score')" prop="F1Score" label="F1-score" />
            <el-table-column v-if="indexsObjectSet.has('Avg-Precision')" prop="AP" label="Average Precision" />
          </el-table>
        </div>
        <div v-if="IOUData.length !== 0">
          <title-style title="mAP" />
          <el-table :data="IOUData" border stripe>
            <el-table-column prop="mAP" label="mAP" />
            <el-table-column prop="IOU" label="IOU" />
          </el-table>
        </div>
        <div v-if="confusionMatrixData" class="margin-top-24">
          <title-style title="混淆矩阵" :download-icon="isMutiCategory" :confusion-matrix-data="confusionMatrix" />
          <div class="flex bgc-blue" style="width: 100%;min-height: 160px;">
            <el-table
              :data="confusionMatrixData"
              :span-method="confusionMatrixDataSpanMethod"
              :show-header="false"
              max-height="500px"
              border
              stripe
            >
              <el-table-column v-for="(item, key) of confusionMatrixData" :key="key" align="center">
                <template v-slot="scope">
                  {{ scope.row[key] }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="classificationReportData.length !== 0" class="margin-top-24">
          <title-style title="评估指标" />
          <div class="flex bgc-blue" style="width: 100%;min-height: 160px;">
            <el-table
              :data="classificationReportData"
            >
              <el-table-column
                prop="name"
                label="名称"
              />
              <el-table-column
                prop="precision"
                label="precision"
              />
              <el-table-column
                prop="recall"
                label="recall"
              />
              <el-table-column
                prop="f1-score"
                label="f1-score"
              />
            </el-table>
          </div>
        </div>
        <div v-if="curveData">
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

import { handleOption } from '@/views/model-manager/model-evaluation/evaluation-result/echarts-config/roc1';
import { getModelEvaluationData, getModelEvaluationInfo, getTaskEvaluationResult } from '@/api/model-evaluation';
import {
  evaluationMetricsDict,
  IOUDataDict
} from '@/views/model-manager/model-evaluation/evaluation-result/evaluation-metrics.ts';
import DetailCard from '@/views/model-manager/components/DetailCard';
export default {
  name: 'Index',
  components: {
    TitleStyle: () => import('@/components/TitleStyle'),
    DetailCard
  },
  data() {
    return {
      info: {
        title: '',
        version: '',
        author: '',
        createTime: ''
      },
      dataSetDetail: {},
      performanceLoading: false,
      dataSetFrom: '',
      dataSetImgList: [],
      evaluationTargets: [], // 评估指标
      IOUData: [], // IOU指标
      microData: [],
      MISCData: [],
      macroData: [],
      classificationReportData: [], // 多分类评估指标
      confusionMatrixData: null, // 混淆矩阵
      confusionMatrix: null,
      curveData: null, // ROC曲线
      otherMetrics: [],
      indexsObjectSet: null,
      modelType: '',
      isMutiCategory: null,
      categorySet: null,
      categoryList: ['ImageCategory', 'ClfModel', 'S-TextClassify'] // 二分类和多分类的类型
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.categorySet = new Set(this.categoryList);
  },
  methods: {
    async init() {
      this.previewModel();
      await this.getModelData();
      this.getTaskResult();
      this.initECharts();
    },
    previewModel() {
      getModelEvaluationInfo(this.$route.query.modelId).then(res => {
        if (res.code === '000000') {
          this.info = res.data;
          this.handleLabelMapping(res.data);
        }
      });
    },
    async getModelData() {
      await getModelEvaluationData({ id: this.$route.query.id }).then(res => {
        if (res.code === '000000') {
          // let data = res.data.data.replace(/\'/g, '"')
          // data = JSON.parse(data)
          // console.log(res, 'res')
          if (Object.keys(res.data).length !== 0) {
            const {
              ConfusionMatrix,
              curve,
              classificationReport,
              IOU,
              micro,
              MISC,
              macro,
              Accuracy,
              AP_0,
              AP_1,
              Precision_0,
              Precision_1,
              Recall_0,
              Recall_1,
              AUC,
              mIOU,
              mpa,
              MPA,
              DICE,
              SA,
              MSE,
              MAE,
              R2,
              RMSE
            } = res.data.dataObject;
            this.modelType = res.data.modelType;
            const { indexsObject } = res.data;
            this.indexsObjectSet = new Set(indexsObject);
            const F1Score_0 = res.data.dataObject['F1-score_0'];
            const F1Score_1 = res.data.dataObject['F1-score_1'];
            const Metrics = { Accuracy, AUC, mpa, MPA, DICE, SA, mIOU, MSE, MAE, R2, RMSE };
            // 待新数据处理
            const Metrics_0 = {
              id: 0,
              Precision: Precision_0,
              Recall: Recall_0,
              F1Score: F1Score_0,
              AP: AP_0
            };
            const Metrics_1 = {
              id: 1,
              Precision: Precision_1,
              Recall: Recall_1,
              F1Score: F1Score_1,
              AP: AP_1
            };
            this.otherMetrics = [Metrics_0, Metrics_1];
            if (Metrics) {
              for (const item in Metrics) {
                // if (Metrics[item]) {
                //   this.evaluationTargets.push({
                //     title: evaluationMetricsDict[item],
                //     result: Metrics[item]
                //   });
                // }
                if (this.indexsObjectSet.has(item)) {
                  this.evaluationTargets.push({
                    title: evaluationMetricsDict[item],
                    result: Metrics[item]
                  });
                }
              }
            }
            if (IOU) {
              const IOUArr = [];
              indexsObject.forEach(ele => {
                IOU.forEach(item => {
                  if (Number(ele) === item.IOU) {
                    const arrItem = {
                      mAP: item.mAP,
                      IOU: IOUDataDict[item.IOU]
                    };
                    IOUArr.push(arrItem);
                  }
                });
              });
              this.IOUData = IOUArr;
            }
            if (micro) {
              this.microData = micro;
            }
            if (MISC) {
              this.MISCData = MISC;
            }
            if (macro) {
              this.macroData = macro;
            }
            if (ConfusionMatrix) {
              this.confusionMatrix = ConfusionMatrix;
              this.confusionMatrixData = [];
              this.confusionMatrixData.push(['预测', '', '']);
              const titleItem = {};
              ConfusionMatrix.y_label.slice(0, 9).forEach((x, index) => {
                titleItem[1] = '名称';
                titleItem[index + 2] = x;
              });
              this.confusionMatrixData.push(titleItem);
              ConfusionMatrix.x_label.slice(0, 9).forEach((y, yIndex) => {
                const item = {};
                titleItem[0] = '真实';
                item[0] = '';
                item[1] = y;
                ConfusionMatrix.value[yIndex].forEach((xValue, index) => {
                  item[index + 2] = xValue;
                });
                this.confusionMatrixData.push(item);
              });
            }
            if (classificationReport) {
              for (const item in classificationReport) {
                this.$set(classificationReport[item], 'name', item);
                this.classificationReportData.push(classificationReport[item]);
              }
            }
            if (this.modelType === 'TextEntityExtraction') {
              for (const item in res.data.dataObject) {
                this.$set(res.data.dataObject[item], 'name', item);
                this.classificationReportData.push(res.data.dataObject[item]);
              }
            }
            if (curve) {
              this.curveData = curve;
            }
          }
        }
      });
    },
    // 获取数据集
    getTaskResult() {
      getTaskEvaluationResult(this.$route.query.dataId).then(res => {
        if (res.code === '000000') {
          this.dataSetDetail = res.data;
          this.dataSetFrom = res.data.table;
        }
      });
    },
    handleLabelMapping(data) {
      if (this.categorySet.has(data.typeCode)) {
        let labelMapping = data.labelMapping.replace(/\'/g, '"');
        labelMapping = JSON.parse(labelMapping);
        const len = Object.keys(labelMapping).length;
        this.isMutiCategory = len > 2;
      }
    },
    returnModelBase() {
      // this.$router.back();
      this.$router.push('/model-manager/evaluation/list');
    },
    toDetailPage() {
      // this.$router.push({
      //   path: `/model-manager/evaluation/evaluation-result/dataset/${this.$route.query.dataId}`,
      //   query: { type: 'evaluation' }
      // })
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
    confusionMatrixDataSpanMethod({ rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          rowspan: 1,
          colspan: 12
        };
      }
      if (columnIndex === 0) {
        if (rowIndex === 1) {
          return {
            rowspan: 12,
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
      if (this.curveData) {
        const roc1 = this.$echarts.init(document.getElementById('roc1Id'));
        const roc1Config = handleOption(this.curveData[0]);
        // 绘制图表
        roc1.setOption(roc1Config);
        const roc2 = this.$echarts.init(document.getElementById('roc2Id'));
        const roc2Config = handleOption(this.curveData[1]);
        // 绘制图表
        roc2.setOption(roc2Config);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - var(--header-height));
  background-color: #edf2f9;
  .crumbs{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    position: absolute;
    z-index: 4;
    background-color: white;
    >div:nth-child(1){
      font-size: 16px;
      font-weight: 700;
      margin-left: 16px;
      color: #646464;
    }
    button{
      margin-right: 16px;
    }
  }
  .content{
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 70px 0 24px;
    padding: 20px 56px;
    background: white;
    box-shadow: 0 2px 6px 0 rgba(194,199,199,0.5);
    z-index: 1;
    overflow: auto;
    .info{
      margin-top: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid #eeeeee;
      .main-title{
        font-size: 16px;
        color: #262626;
      }
      .sub-title{
        margin-top: 24px;
        font-size: 14px;
        color: #646464;
        >{
          div{
            margin-top: 8px;
          }
        }
      }
    }
    .data-set{
      margin-top: 24px;
      margin-bottom: 24px;
      width: 100%;
      border-bottom: 1px solid #eeeeee;
      .data-set-list{
        display: flex;
        flex-wrap: wrap;
        >div{
          display: flex;
          flex-wrap: wrap;
          width: 146px;
          height: 80px;
        }
      }
    }
  }
}
::v-deep{
  .el-table--border .el-table__body-wrapper td:nth-of-type(1){
    border-top: 1px solid #EBEEF5;
  }
}
</style>
