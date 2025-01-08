<template>
  <div class="model-manager-detail">
    <div class="crumbs">
      <el-tooltip
        class="item"
        effect="dark"
        :content="modelInfo.modelNameCh"
        placement="top"
      >
        <div>{{ modelInfo.modelNameCh }}</div>
      </el-tooltip>
      <div class="statistics">
        <!--左-->
        <div class="flex align-center" style="width: 80%;height: 100%; margin-left: 20px">
          <!--模型状态-->
          <div class="flex align-center margin-right-24">
            <div v-if="modelInfo.status==='WAIT_FIRST_JUDGE'" class="round" style="width: 11px;height: 11px;background: #00B1B2" />
            <div v-if="modelInfo.status==='WAIT_FINAL_JUDGE'" class=" round" style="width: 11px;height: 11px;background: #00B1B2;" />
            <div v-if="modelInfo.status==='REJECT'" class=" round" style="width: 11px;height: 11px;background: #E56E0D;" />
            <div v-if="modelInfo.status==='OFF_LINE'" class=" round" style="width: 11px;height: 11px;background: #8C8C8C;" />
            <div v-if="modelInfo.status==='ON_LINE'" class=" round" style="width: 11px;height: 11px;background: #00AB5A;" />
            <i v-if="modelInfo.status === 'DEVELOYMENT_FAIL'" style="color: #FD5E3A" class="el-icon-warning-outline icon" />
            <div v-if="modelInfo.status==='UNDER_DEVELOYMENT'" class=" round" style="width: 11px;height: 11px;background: #00B1B2;" />
            <i v-if="modelInfo.status === 'UNDER_DEVELOYMENT'" style="color: #0164FF" class="el-icon-time icon" />
            <div class=" font-size-14 margin-left-8" style="">
              <div v-if="modelInfo.status==='WAIT_FIRST_JUDGE'">
                待初审
              </div>
              <div v-if="modelInfo.status==='WAIT_FINAL_JUDGE'">
                待终审
              </div>
              <div v-if="modelInfo.status==='REJECT'">
                驳回
              </div>
              <div v-if="modelInfo.status==='OFF_LINE'">
                已下线
              </div>
              <div v-if="modelInfo.status==='ON_LINE'">
                已上线
              </div>
              <div v-if="modelInfo.status==='UNDER_DEVELOYMENT'">
                部署中
              </div>
              <div v-if="modelInfo.status==='DEVELOYMENT_FAIL'">
                部署失败
              </div>
              <div v-if="modelInfo.status==='WAIT_RELEASE'">
                未发布
              </div>
            </div>
          </div>
          <!--实例数-->
          <div class="flex align-center margin-right-24 font-size-14">
            <div class="flex">
              实例数
            </div>
            <div class="flex margin-left-8">
              {{ modelInfo.minInstance }} - {{ modelInfo.maxInstance }}
            </div>
          </div>
          <!--实例配置-->
          <div class="flex align-center margin-right-24 font-size-14">
            <div class="flex">
              实例配置
            </div>
            <div class="flex margin-left-8 font-size-14">
              <div class="flex">
                CPU:{{ modelInfo.cpu }} m
              </div>
              <div class="flex">
                GPU:{{ modelInfo.gpu }}
              </div>
            </div>
          </div>
          <!--Memory-->
          <div class="flex align-center margin-right-24 font-size-14">
            <div class="flex">
              Memory:
            </div>
            <div class="flex margin-left-8">
              {{ modelInfo.memory }} Mi
            </div>
          </div>
        </div>
        <!--右-->
        <div v-if="modelInfo.status ==='WAIT_FIRST_JUDGE'" class="flex justify-end align-center" style="width: 10%;height: 100%;">
          <!--初审通过-->
          <div class="flex" style="margin-right: 54px;">
            <el-button type="primary" style="border: 1px solid rgba(1,100,255,1);" size="mini" @click="ShowFirstCheckDialog=true">初审</el-button>
          </div>
        </div>
        <div v-if="modelInfo.status ==='WAIT_FINAL_JUDGE'" class="flex justify-end align-center" style="width: 10%;height: 100%;">
          <!--终审通过-->
          <div class="flex" style="margin-right: 54px;">
            <el-button type="primary" style="border: 1px solid rgba(1,100,255,1);" size="mini" @click="showLastCheckDialog=true">终审</el-button>
          </div>
        </div>
      </div>
      <el-button class="return-btn" icon="el-icon-caret-left" @click="returnPushManager">返回</el-button>
    </div>
    <div class="content" style="min-width: var(--main-div-min-width);max-width: 1200px;">
      <div class="flex flex-direction align-center" style="height: calc(100% - 40px); overflow: auto; margin: 0 0 16px; padding: 0 56px; width: 100%">
        <slot class="" />
        <div v-if="$slots.default" class="flex" style="margin-top: 40px;" />
        <div
          class="flex flex-direction padding-bottom-16"
          style="width: 100%;z-index: 1"
        >
          <!--Demo-->
          <div class="flex align-center border-bottom padding-bottom-24 margin-top-24" style="width: 100%;">
            <!--大左-->
            <div class="flex justify-between" style="width: 80%;">
              <!--左-->
              <div class="flex" style="width: 40%;height: 140px;">
                <img
                  v-if="modelInfo.coverUrl!==undefined && modelInfo.coverUrl!=null"
                  :src="modelInfo.coverUrl"
                  alt=""
                  height="100%"
                  width="100%"
                >
              </div>
              <!--中-->
              <div class="flex flex-direction" style="width: 55%;">
                <div class="flex font-weight font-size-16 color-title margin-bottom-8">
                  {{ modelInfo.id }}-{{ modelInfo.modelNameCh }}
                </div>
                <content-style
                  :text="modelInfo.modelShortDescribe"
                  style="margin-bottom: 24px;word-break: break-all;"
                />
                <div class="flex font-size-14 color-title-2 margin-bottom-24">
                  <div class="flex">
                    版本 {{ modelInfo.versionName }}
                  </div>
                  <div class="flex margin-left-16">
                    更新时间 {{ modelInfo.updateTime }}
                  </div>
                </div>
                <div class="flex">
                  <div class="flex font-size-12 padding-8 color-blue bgc-blue-light border-radius-4">
                    {{ modelInfo.scenesName }}
                  </div>
                  <div class="flex font-size-12 margin-left-16 padding-8 color-green bgc-green-light border-radius-4">
                    {{ modelInfo.modelTypeName }}
                  </div>
                </div>
              </div>
            </div>
            <!--右-->
            <div v-if="!preview" class="flex flex-1 justify-center align-center">
              <!--            <el-button type="primary" ></el-button>-->
              <el-button v-if="modelStatus === 'ON_LINE'" :disabled="hasUnionDataSet" class="operation-primary-button font-size-14" style="height: 40px;" @click="clickUseDemo">体验Demo</el-button>
            </div>
          </div>
          <!--模型说明-->
          <div class="flex flex-direction border-bottom margin-top-24">
            <title-style title="模型说明" />
            <!--          <content-style-->
            <!--            :text="modelInfo.modelDescribe">-->
            <!--          </content-style>-->
            <!--          <markdown-editor :is-edit="false" v-model="modelInfo.modelDescribe" />-->
            <viewer v-if="modelInfo.modelDescribe" :initial-value="modelInfo.modelDescribe" height="500px" />
          </div>
          <!--算法原理-->
          <div v-if="false" class="flex flex-direction border-bottom margin-top-24">
            <title-style title="算法原理" />
            <content-style
              :text="modelInfo.algorithmMethod"
            />
          </div>
          <!--模型效果-->
          <div v-if="false" class="flex flex-direction border-bottom margin-top-24" style="width: 100%;">
            <title-style title="模型效果" />
            <div class="flex" style="width: 100%;">
              <!--左-->
              <div class="flex border-right" style="width: 50%;">
                <!--左-->
                <div class="flex flex-direction" style="width: 50%;">
                  <div class="flex font-size-14 color-title">
                    <div class="padding-8">
                      准确率
                    </div>
                    <div class="padding-8">
                      <i class="el-icon-question color-title-2" style="width: 12px;height: 12px;" />
                    </div>
                  </div>
                  <!--百分比-->
                  <div class="flex">
                    <div class="flex font-weight font-size-24 color-blue padding-8">
                      98.4%
                    </div>
                  </div>
                  <!--表格-->
                  <div id="AccuracyEchartId" class="flex" style="width: 290px;height: 210px;" />
                </div>
                <!--右-->
                <div class="flex flex-direction" style="width: 50%;">
                  <div class="flex font-size-14 color-title">
                    <div class="padding-8">
                      F1-score
                    </div>
                    <div class="padding-8">
                      <i class="el-icon-question color-title-2" style="width: 12px;height: 12px;" />
                    </div>
                  </div>
                  <!--百分比-->
                  <div class="flex">
                    <div class="flex font-weight font-size-24 color-blue padding-8">
                      98.4%
                    </div>
                  </div>
                  <!--表格-->
                  <div id="F1ScoreId" class="flex" style="width: 290px;height: 210px;" />
                </div>
              </div>
              <!--右-->
              <div class="flex" style="width: 50%;height: 100%">
                <!--左-->
                <div id="echart3" class="flex" style="width: 50%;height: 200px;" />
                <!--右-->
                <div id="echart4" class="flex" style="width: 50%;height: 200px;" />
              </div>
            </div>
          </div>
          <!--模型代码-->
          <div v-if="false" class="flex flex-direction border-bottom margin-top-24">
            <title-style title="模型代码" />
            <el-input
              v-model="modelInfo.code"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="请输入内容"
            />
          </div>
          <!--api json展示格式-->
          <div v-if="false && !preview" class="flex flex-direction border-bottom margin-top-24">
            <title-style title="API服务接口" />
            <json-viewer
              :value="modelInfo.api"
              :expand-depth="10"
              boxed
            />
          </div>
          <!--api服务接口-->
          <div v-if="!preview && modelStatus === 'ON_LINE'" class="flex flex-direction border-bottom margin-top-24">
            <title-style title="API服务接口" :end-icon="true" :source-route="'push-model'" :model-id="$route.params.id" />
            <div class="flex align-center margin-bottom-16" style="width: 100%;height: 32px;">
              <!--method-->
              <div class="flex margin-left-16 margin-right-24 padding-8 bgc-blue-light color-blue" style="height: 100%;border-radius: 4px;">
                <!--              {{modelInfo.api.method!=undefined && modelInfo.api.method!=null ? modelInfo.api.method : 'POST'}}-->
                POST
              </div>
              <div
                class="flex flex-1 bgc-blue-light color-content justify-between align-center padding-left-16"
                style="height: 100%;border-radius: 4px;"
                @mouseover="showCopy = true"
                @mouseleave="showCopy = copyFinish = false"
              >
                <span class="flex">
                  <i v-if="modelInfo.api && modelInfo.api.url === '未授权'" class="el-icon-warning" style="margin-right: 8px; color: #FD5E3A" />
                  <i v-if="modelInfo.api && modelInfo.api.url === '已过期'" class="el-icon-warning" style="margin-right: 8px; color: #E56E0D" />
                  <i v-if="modelInfo.api && modelInfo.api.url === '已下线'" class="el-icon-warning" style="margin-right: 8px; color: #E56E0D" />
                  {{ modelInfo.api && modelInfo.api.url }}
                </span>
                <el-tooltip class="item" effect="dark" content="复制" placement="top">
                  <span
                    v-show="showCopy"
                    class="hand margin-right-16 copyItem"
                    data-clipboard-action="copy"
                    :data-clipboard-text="modelInfo.api && modelInfo.api.url"
                    @click="copySuccess"
                  >
                    <i v-show="!copyFinish" class="el-icon-document-copy" />
                    <i v-show="copyFinish" class="el-icon-document-checked" />
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
          <!--header请求参数-->
          <div v-if="!preview" class="flex flex-direction margin-top-24">
            <title-style title="Headers" :font-size="16" />
            <el-table border :data="modelInfo.api && modelInfo.api.headerExampleTypeDescs">
              <el-table-column prop="name" label="字段名" />
              <el-table-column prop="necessity" label="必填项" />
              <el-table-column prop="type" label="字段类型" />
              <el-table-column width="400px" prop="desc" label="字段描述" />
            </el-table>
          </div>
          <!--api请求参数-->
          <div v-if="!preview" class="flex flex-direction margin-top-24">
            <title-style title="API请求参数" />
            <el-table border :data="modelInfo.api && modelInfo.api.requestExampleTypeDescs">
              <el-table-column prop="name" label="字段名" />
              <el-table-column prop="necessity" label="必填项" />
              <el-table-column prop="type" label="字段类型" />
              <el-table-column prop="desc" label="字段描述" />
            </el-table>
          </div>
          <!--api请求参数示例-->
          <div v-if="!preview" class="flex flex-direction margin-top-24">
            <title-style title="API请求参数示例" />
            <json-viewer
              :value="modelInfo.api && modelInfo.api.requestRationalExample"
              :expand-depth="10"
              boxed
            />
          </div>
          <!--api返回参数-->
          <div v-if="!preview" class="flex flex-direction margin-top-24">
            <title-style title="API返回参数" />
            <el-table border :data="modelInfo.api && modelInfo.api.responseExampleTypeDescs">
              <el-table-column prop="name" label="字段名" />
              <el-table-column prop="necessity" label="必填项" />
              <el-table-column prop="type" label="字段类型" />
              <el-table-column prop="desc" label="字段描述" />
            </el-table>
          </div>
          <!--api返回参数示例-->
          <div v-if="!preview" class="flex flex-direction margin-top-24">
            <title-style title="API返回参数示例" />
            <json-viewer
              :value="modelInfo.api && modelInfo.api.responseRationalExample"
              :expand-depth="10"
              boxed
            />
          </div>
          <!--数据介绍-->
          <div v-if="false" class="flex flex-direction margin-top-24">
            <title-style title="数据介绍" />
            <content-style text="数据集为最便宜的电动汽车数据集，该数据集包括11个字段，数据集包括电动汽车的行程、速度、加速度、效率等字段。" />
          </div>
          <!--开发团队-->
          <div v-if="false" class="flex flex-direction margin-top-24">
            <title-style title="开发团队" />
            <div
              v-for="(item) in DevelopmentTeam"
              :key="item.id"
              class="padding-8 flex color-content font-size-14 line-height-22"
            >
              {{ item.title+''+item.author }}
            </div>
            <div class="flex color-title-2 align-center">
              <div class="flex bgc-white margin-top-16 margin-bottom-16 padding-8">
                技术支持： 北京大数据研究院
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--初审弹窗-->
    <first-check-ok
      v-if="ShowFirstCheckDialog"
      :text="text"
      style="z-index: 44"
      @ok="firstCheckOk"
      @reject="firstCheckReject"
      @cancel="firstCheckCancel"
    />
    <!--终审操作弹窗-->
    <push-to-data
      v-if="showLastCheckDialog"
      :text="text"
      :params="finalCheckData"
      @ok="lastCheckOk"
      @reject="lastCheckReject"
      @cancel="lastCheckCancel"
    />
  </div>
</template>

<script>
import FirstCheckOk from '@/views/model-manager/components/FirstCheckOk';
import { finalJudgeOk, finalJudgeReject, firstJudgeOk, firstJudgeReject, previewModel } from '@/api/model';
import PushToData from '@/views/model-manager/components/PushToData';
import AccuracyEchartChartConfig from '@/views/model-base/model-detail/echarts-config/AccuracyEchartChart';
import F1ScoreEChartConfig from '@/views/model-base/model-detail/echarts-config/F1ScoreEChart';
import echart3Config from '@/views/model-base/model-detail/echarts-config/echart3';
import echart4Config from '@/views/model-base/model-detail/echarts-config/echart4';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';
export default {
  name: 'Index',
  components: {
    PushToData,
    FirstCheckOk,
    TitleStyle: () => import('@/components/TitleStyle'),
    ContentStyle: () => import('@/components/ContentStyle'),
    JsonViewer: () => import('vue-json-viewer'),
    viewer: Viewer
  },
  data() {
    return {
      text: '',
      modelInfo: {},
      showCopy: false,
      copyFinish: false,
      preview: false, // 是否是预览
      ShowFirstCheckDialog: false, // 初审
      selectedModelId: 0,
      finalCheckData: null,
      showLastCheckDialog: false, // 终审
      modelStatus: '',
      showFirst: false,
      showLast: false,
      hasUnionDataSet: false
    };
  },
  mounted() {
    this.modelStatus = sessionStorage.getItem('modelStatus');
    this.loading = true;
    this.selectedModelId = this.$route.params.id;
    // this.initECharts()
    // 正常查看模型详情
    if (this.$route.params.id !== undefined && this.$route.params.id != null) {
      if (this.$route.params.id !== '99999999') { // 查看模型详情
        this.previewModel();
        // this.getModelInfoWithCode()
      } else { // 模型预览
        this.preview = true;
        this.modelInfo = JSON.parse(JSON.stringify(this.$store.state.modelBase.preview));
        // console.log('this.modelInfo:', this.modelInfo);
        this.loading = false;
      }
    }
    this.hasUnionDataSet = sessionStorage.getItem('hasUnionDataSet') === 'false';
  },
  methods: {
    copySuccess() {
      // const copyContent = new this.$clipboard('.copyItem')
      this.copyFinish = true;
      this.$message({
        message: '复制成功!',
        type: 'success'
      });
    },
    previewModel() {
      previewModel(this.$route.params.id).then(res => {
        this.modelInfo = res.data;
        this.finalCheckData = JSON.parse(JSON.stringify(this.modelInfo));
      });
    },
    clickUseDemo() {
      this.$router.push('/model-manager/push/experience/' + this.$route.params.id + '/' + this.modelInfo.modelNameCh + '/' + this.modelInfo.modelTypeName);

      this.$store.commit('modelPush/ADD_HEIGHT', { height: true });
    },
    initECharts() {
      const AccuracyEChart = this.$echarts.init(document.getElementById('AccuracyEchartId'));
      // 绘制图表
      AccuracyEChart.setOption(AccuracyEchartChartConfig);
      const F1ScoreEChart = this.$echarts.init(document.getElementById('F1ScoreId'));
      // 绘制图表
      F1ScoreEChart.setOption(F1ScoreEChartConfig);
      const echart3 = this.$echarts.init(document.getElementById('echart3'));
      // 绘制图表
      echart3.setOption(echart3Config);
      const echart4 = this.$echarts.init(document.getElementById('echart4'));
      // 绘制图表
      echart4.setOption(echart4Config);
    },
    firstCheckOk(text) {
      const params = {
        id: this.selectedModelId,
        remark: text
      };
      firstJudgeOk(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '初审已通过!',
            type: 'success'
          });
          this.text = '';
          this.previewModel();
        } else {
          this.$message({
            message: '初审通过失败!',
            type: 'error'
          });
        }
      });
      this.firstCheckCancel();
    },
    firstCheckReject(text) {
      const params = {
        id: this.selectedModelId,
        remark: text
      };
      firstJudgeReject(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '初审已驳回!',
            type: 'success'
          });
          this.text = '';
          this.previewModel();
        } else {
          this.$message({
            message: '初审驳回失败!',
            type: 'error'
          });
        }
      });
      this.firstCheckCancel();
    },
    firstCheckCancel() {
      this.ShowFirstCheckDialog = false;
    },
    lastCheckOk(params) {
      params.id = this.selectedModelId;
      finalJudgeOk(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '终审已通过!',
            type: 'success'
          });
          this.text = '';
          this.previewModel();
        } else {
          this.$message({
            message: '终审通过失败!',
            type: 'error'
          });
        }
      });
      this.lastCheckCancel();
    },
    lastCheckReject(params) {
      params.id = this.selectedModelId;
      finalJudgeReject(params).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '终审已驳回!',
            type: 'success'
          });
          this.text = '';
          this.previewModel();
        } else {
          this.$message({
            message: '终审驳回失败!',
            type: 'error'
          });
        }
      });
      this.lastCheckCancel();
    },
    lastCheckCancel() {
      this.showLastCheckDialog = false;
    },
    returnPushManager() {
      this.$router.push('/model-manager/push/list');
      this.$store.commit('modelPush/CLEAR_HEIGHT', { height: false });
    }

  }
};
</script>

<style lang="scss" scoped>
.model-manager-detail{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 1200px;
  height: calc(100vh - var(--header-height));
  background-color: #edf2f9;
  .crumbs{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    position: absolute;
    background-color: white;
    .statistics{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 80%;
    }
    >div:nth-child(1){
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    position: relative;
    width: 90%;
    height: calc(100% - 90px);
    margin: 66px 0 24px;
    background-color: white;
    // overflow-y: auto;
  }
}
.copyItem{
  color: #646464;
  &:hover{
    color: #0164FF;
  }
  &:active{
    color: #0164FF;
  }
}
</style>
