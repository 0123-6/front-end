<template>
  <!--最外层-->
  <div style="height: 100%">
    <ai-header />
    <div class="flex flex-direction model-validate-container">
      <div class="flex flex-direction model-validate-title-container">
        <div class="flex flex-direction" style="flex-direction:row; align-items: center; width: 1200px">
          <div class="font-size-16 font-weight color-content">
            推理结果
          </div>
          <div class="margin-left-20 font-size-14 color-content" style="margin-left: 150px;">
            模型：{{ dataQuery && dataQuery.modelName }}
          </div>
          <div class="margin-left-20 font-size-14 color-content" style="margin-left: 150px;">
            数据集：{{ dataQuery && dataQuery.datasetName }}
          </div>
        </div>
      </div>
      <div class="flex justify-center" style="height: calc(100% - 110px); min-height: 420px">
        <div v-loading="loading" style="width: 1200px; height: 100%; justify-content: center">
          <div class="bgc-white padding-top-24 padding-bottom-24 margin-top-8 margin-bottom-16 box-shadow-1" style="width: 100%; height:100%;background: #F6FAFF;">
            <div class="flex justify-around" style="max-height: 534px;height: 100%;width: 100%">
              <!--左-->
              <div class="flex align-center box-shadow-1 bgc-white" style="width: 75%;height: 100%;">
                <!--有内容-->
                <div v-if="HadContent" style="width: 100%;height: 100%;">
                  <!--图像分类-->
                  <el-carousel v-if="modelType==='ImageCategory'" style="height: 100%;" :autoplay="false" @change="changeResultIndex">
                    <el-carousel-item v-for="(item,index) in result.data.images" :key="index" style="height: 100%;">
                      <div style="width: 100%;height: 100%;">
                        <image-show :src="item" />
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                  <!--回归预测模型-->
                  <el-table
                    v-if="modelType==='RpModel'"
                    ref="multipleTable"
                    border
                    :data="result.csvData"
                    height="100%"
                    width="100%"
                    @mousedown.native="mouseDownHandler"
                    @mouseup.native="mouseUpHandler"
                    @mousemove.native="mouseMoveHandler"
                  >
                    <el-table-column v-for="(item,index) in result.csvTitle" :key="index" :prop="item" :label="item" />
                  </el-table>
                  <!--图像分割-->
                  <div v-if="modelType==='ImageSegment'" class="flex" style="width: 100%;height: 100%;position: relative;">
                    <div style="width: 100%;height: 100%;">
                      <image-show :src="result.data.images[0]" />
                    </div>
                    <div style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;opacity: 0.9;">
                      <image-show :src="result.data.images[1]" />
                    </div>
                  </div>
                  <!--分类模型-->
                  <div v-if="modelType==='ClfModel'" style="width: 100%;height: 100%;">
                    <el-table v-if="result && result.csvData!==undefined && result.csvData!=null" border :data="result.csvData" height="100%" width="100%">
                      <el-table-column v-for="(item,index) in result.csvTitle" :key="index" :prop="item" :label="item" />
                    </el-table>
                    <div
                      v-if="result && result.txtData!==undefined && result.txtData!=null"
                      style="width: 100%;height: 100%;overflow:auto;"
                      class="flex flex-direction"
                    >
                      <div
                        v-for="(item,index) in result.txtData"
                        :key="index"
                        class="flex padding-8 hover-bgc-blue"
                        style="width: 100%;"
                      >
                        <span
                          style="width: 100%;height:40px;line-height: 20px"
                          class="text-hidden-2 "
                        >
                          {{ item }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!--文本多标签-->
                  <div
                    v-if="modelType==='文本分类-多标签' || modelType==='文本分类-单标签' || modelType==='S-TextClassify'"
                    class="flex flex-direction bgc-white font-size-14 color-content"
                    style="width: 100%;height: 100%;overflow: auto;"
                  >
                    <div
                      v-for="(item,index) in result.txtData"
                      :key="index"
                      style="height: 80px;"
                      class="hand text-hidden padding-24"
                      :class="[resultIndex===index?'bgc-blue-light box-shadow-1':'']"
                      @click="changeResultIndex(index)"
                    >
                      {{ item }}
                    </div>
                  </div>
                  <!--物体检测-->
                  <el-carousel v-if="modelType ==='ObjectTest'" style="height: 100%;width: 100%;" :autoplay="false" @change="changeResultIndex">
                    <el-carousel-item v-for="(item,index) in result.data.images" :key="index" style="width: 100%;height: 100%;">
                      <div style="width: 100%;height: 100%;">
                        <image-with-rectangle :rectangle-list="result.labelString[resultIndex]" :color="colorList" :pic-size="result.labelString[resultIndex][0] && result.labelString[resultIndex][0].picSize" :pic-url="item" />
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                  <!--文本实体抽取-->
                  <text-entity-extraction-left
                    v-if="modelType==='TextEntityExtraction'"
                    :color-list="colorList"
                    :color-rules="colorRules"
                    :data="result.data"
                  />
                </div>
                <div v-else class="flex flex-direction justify-center align-center" style="width: 100%;height: 100%;">
                  <div class="flex margin-bottom-16">
                    <img src="@/assets/images/nothing.png" alt="">
                  </div>
                  <div class="flex font-size-16" style="color: #AFAAAA;">暂无内容</div>
                </div>
              </div>
              <!--右-->
              <div class="flex flex-direction box-shadow-1 bgc-white" style="width: 20%;height: 100%;">
                <!--识别信息-->
                <div class="flex align-center border-bottom padding-left-16 padding-right-16 padding-top-8 padding-bottom-8 margin-top-8">
                  <title-style v-if="modelType!=='TextEntityExtraction'" title="识别信息" not-margin-bottom />
                  <title-style v-if="modelType==='TextEntityExtraction'" title="命名实体类型" not-margin-bottom />
                </div>
                <!--内容-->
                <div v-if="HadContent" class="flex flex-1 flex-direction padding-left-16 padding-right-16 overflow-auto" style="width: 100%;">
                  <!--图像分类-->
                  <template v-for="(item,index) in result.labelString[resultIndex]">
                    <div
                      v-if="modelType==='ImageCategory'"
                      :key="index"
                      class="flex align-center bgc-blue-light margin-top-24 border-radius-4"
                      style="width: 100%;height: 40px;"
                    >
                      <span class="margin-left-8 margin-right-8" style="min-width: 46px;">{{ item.name }}</span>
                      <span class="text-hidden" style="">{{ Number(item.value).toFixed(6) }}</span>
                    </div>
                  </template>
                  <!--回归-->
                  <div v-if="modelType==='RpModel'" style="width: 100%;height: 100%;">
                    <el-table border :data="result.label" height="100%">
                      <el-table-column prop="value" label="预测值" />
                    </el-table>
                  </div>
                  <!--图像分割-->
                  <template v-for="(item,index) in result.labelString[0]">
                    <div
                      v-if="modelType==='ImageSegment'"
                      :key="index"
                      class="flex align-center bgc-blue-light margin-top-24 padding-right-24"
                      style="width: 100%;height: 40px;"
                    >
                      <div class="flex bgc-blue" style="width: 4px;height: 100%" />
                      <div class="flex flex-1 align-center margin-left-8 color-content font-size-14" style="height: 100%;">
                        <span class="" style="width: 106px;min-width: 106px;">{{ item.name }}</span>
                        <!--                  <span class="text-hidden" style="width: calc(100% - 106px);">{{item.value}}</span>-->
                      </div>
                    </div>
                  </template>
                  <!--分类模型-->
                  <div v-if="modelType==='ClfModel' && result!=null" style="width: 100%;height: 100%;">
                    <el-table v-if="result!=null" border :data="result.labelString" height="100%">
                      <el-table-column label="预测值">
                        <template slot-scope="scope">
                          <div class="flex flex-direction">
                            <div v-for="(item,index) in scope.row" :key="index" class="flex">
                              <span>{{ item.name }}</span>
                              <span class="margin-left-8">{{ Number(item.value).toFixed(6) }}</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <!--文本多标签-->
                  <template v-for="(item,index) in result.labelString[resultIndex]">
                    <div
                      v-if="(modelType==='文本分类-多标签' || modelType==='文本分类-单标签' || modelType==='S-TextClassify') && result"
                      :key="index"
                      class="flex align-center bgc-blue-light margin-top-16"
                      style="min-width: 100%;width: max-content;height: 40px;"
                    >
                      <span class="margin-left-8" style="width: 130px;min-width: 130px;">{{ item.name }}</span>
                      <span class="text-hidden" style="width: calc(100% - 130px);">{{ Number(item.value).toFixed(6) }}</span>
                    </div>
                  </template>
                  <!--物体检测-->
                  <template v-for="(item,index) in result.labelString[resultIndex]">
                    <div
                      v-if="modelType==='ObjectTest' && result!=null"
                      :key="index"
                      class="flex align-center margin-top-16 hand"
                      :class="[index===modelExperienceIndex?'color-white':'color-content']"
                      style="min-width: 100%;width: max-content;height: 28px;line-height: 28px;"
                      @click="modelExperienceIndex=index===modelExperienceIndex?-1:index"
                    >
                      <div style="width: 4px;height: 100%;border-radius: 4px 0 0 4px;" :style="{'background-color':colorList[index%colorList.length].color}" />
                      <div class="padding-left-8 flex align-center text-hidden" style="width: 130px;min-width: 130px;height: 100%;" :style="{'background-color':index===modelExperienceIndex?colorList[index%colorList.length].color:colorList[index%colorList.length].bgcColor}">
                        {{ item.name }}
                      </div>
                      <div class="text-hidden flex align-center" style="width: calc(100% - 130px);height: 100%;" :style="{'background-color':index===modelExperienceIndex?colorList[index%colorList.length].color:colorList[index%colorList.length].bgcColor}">{{ Number(item.value).toFixed(6) }}</div>
                    </div>
                  </template>
                  <!--文本实体抽取-->
                  <text-entity-extraction-right
                    v-if="modelType==='TextEntityExtraction'"
                    :color-list="colorList"
                    :data="result.labelString"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleStyle from '@/components/TitleStyle';

import { getDataSetPredict } from '@/api/model';
import TextEntityExtractionLeft from '@/components/TextEntityExtractionLeft';
import TextEntityExtractionRight from '@/components/TextEntityExtractionRight';
import AiHeader from '@/layout/components/AiHeader';
export default {
  name: 'Index',
  components: {
    AiHeader,
    TextEntityExtractionRight,
    TextEntityExtractionLeft,
    TitleStyle,
    ImageShow: () => import('@/components/ImageShow'),
    ImageWithRectangle: () => import('@/components/ImageWithRectangle')
  },
  data() {
    return {
      HadContent: false,
      dialogVisible: false,
      modelName: '',
      id: '',
      loading: false,
      result: null,
      resultIndex: 0,
      modelType: '',
      colorList: [
        {
          color: 'rgb(247,130,144)',
          bgcColor: 'rgba(247,130,144,0.3)',
          bgcColorDeep: 'rgba(247,130,144,0.7)'
        },
        {
          color: 'rgb(249,181,123)',
          bgcColor: 'rgba(249,181,123,0.3)',
          bgcColorDeep: 'rgba(249,181,123,0.7)'
        },
        {
          color: 'rgb(245,216,145)',
          bgcColor: 'rgba(245,216,145,0.3)',
          bgcColorDeep: 'rgba(245,216,145,0.7)'
        },
        {
          color: 'rgb(189,219,148)',
          bgcColor: 'rgba(189,219,148,0.3)',
          bgcColorDeep: 'rgba(189,219,148,0.7)'
        },
        {
          color: 'rgb(150,198,250)',
          bgcColor: 'rgba(150,198,250,0.3)',
          bgcColorDeep: 'rgba(150,198,250,0.7)'
        },
        {
          color: 'rgb(174,157,251)',
          bgcColor: 'rgba(174,157,251,0.3)',
          bgcColorDeep: 'rgba(174,157,251,0.7)'
        },
        {
          color: 'rgb(227,153,192)',
          bgcColor: 'rgba(227,153,192,0.3)',
          bgcColorDeep: 'rgba(227,153,192,0.7)'
        },
        {
          color: 'rgb(153,169,227)',
          bgcColor: 'rgba(153,169,227,0.3)',
          bgcColorDeep: 'rgba(153,169,227,0.7)'
        },
        {
          color: 'rgb(153,227,225)',
          bgcColor: 'rgba(153,227,225,0.3)',
          bgcColorDeep: 'rgba(153,227,225,0.7)'
        }
      ],
      colorRules: {},
      mouseFlag: false,
      mouseOffset: 0
    };
  },
  computed: {
    modelExperienceIndex: {
      get() {
        return this.$store.state.modelBase.modelExperienceIndex;
      },
      set(value) {
        this.$store.commit('setModelExperienceIndex', value);
      }
    }
  },
  created() {
    this.dataQuery = JSON.parse(this.$route.query.data);
    console.log('this.dataQuery:',this.dataQuery)
    this.getResult(null);
  },
  methods: {
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mouseDownHandler(e) {
      this.mouseOffset = e.clientX;
      this.mouseFlag = true;
    },
    mouseUpHandler(e) {
      this.mouseFlag = false;
    },
    mouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.multipleTable) return;
      const divData = this.$refs.multipleTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    returnModelBase() {
      this.$router.back();
    },
    getResult() {
      const params = {
        datasetId: this.dataQuery.datasetId,
        modelId: this.dataQuery.modelId
      };
      getDataSetPredict(params).then(res => {
        if (res.code === '000000') {
          this.HadContent = true;
          this.result = res.data;
          this.modelType = res.data.modelTaskType;
          this.handleData(res.data);
        }
      }).catch(() => {
        this.loading = false;
        this.HadContent = true;
      });
    },
    handleData(data) {
      if (data.modelTaskType === 'RpModel' || data.modelTaskType === 'ClfModel') {
        const newLabel = [];
        for (let i = 0; i < data.label.length; i++) {
          newLabel.push({
            value: Number(data.label[i]).toFixed(6)
          });
        }
        data.label = newLabel;

        if (data.modelTaskType === 'ClfModel' && data.csvData === undefined) {
          return;
        }

        const newCsvTitle = [];
        for (let i = 0; i < data.csvData[0].length; i++) {
          newCsvTitle.push(data.csvData[0][i]);
        }
        data.csvTitle = newCsvTitle;
        data.csvData.splice(0, 1);
        const newCsvData = [];
        for (let i = 0; i < data.csvData.length; i++) {
          const params = {};
          for (let j = 0; j < data.csvData[i].length; j++) {
            params[data.csvTitle[j]] = data.csvData[i][j];
          }
          newCsvData.push(params);
        }
        data.csvData = newCsvData;
      } else if (data.modelTaskType === 'TextEntityExtraction') {
        for (let i = 0; i < data.labelString.length; i++) {
          this.colorRules[data.labelString[i]] = i;
        }
        this.modelExperienceIndex = data.labelString[0];
      }
    },
    changeResultIndex(index) {
      this.resultIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.model-validate-container {
  width: 100%;
  height: calc(100% - 60px);
  background: #e4edf8;
  min-width: 1200px;
  .model-validate-title-container{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50px;
    justify-content: center;
    min-height: 50px;
    background: #ffffff;
  }
}
</style>
