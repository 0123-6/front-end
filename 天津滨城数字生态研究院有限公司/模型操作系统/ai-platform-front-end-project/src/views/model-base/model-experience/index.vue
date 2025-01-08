<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-main align-center" style="min-width: 100%;height: 100%;width: 100%;">
    <upload-file
      v-if="dialogVisible"
      :form-web-type="'experience'"
      @ok="upLoadOk"
      @cancel="upLoadCancel"
    />
    <!--顶部数据-->
    <div class="flex justify-between align-center bgc-white" style="width: 100%;height: 50px;min-height: 50px;">
      <div class="font-size-16 font-weight color-content margin-left-16">
        {{ modelName }}
      </div>
      <!--      <div class="flex bgc-white justify-center align-center hand" @click="returnModelBase" style="width: 54px;height: 24px;border: 1px solid rgba(197,201,207,1);margin-right: 20px;">-->
      <!--        <div style="margin-right: 8px;">-->
      <!--          <i class="el-icon-caret-left" style="width: 7px;height: 7px;color: #646464;"></i>-->
      <!--        </div>-->
      <!--        <div class="flex font-size-14 color-title" >返回</div>-->
      <!--      </div>-->
      <el-button class="return-btn" icon="el-icon-caret-left" style="margin-right: 20px;" @click="returnModelBase">返回</el-button>
    </div>
    <div v-loading="loading" class="flex flex-1 flex-direction padding-left-24 padding-right-24" style="width: 100%;min-width: var(--main-div-min-width);">
      <!--上传功能-->
      <!-- <div class="flex align-center padding-bottom-8 margin-top-16" style="width: 100%;">
        <el-button type="primary" style="border-radius: 4px;" @click="dialogVisible = true">选择数据集</el-button> -->
      <!--        <div class="flex font-size-12 color-title-2 margin-left-16">-->
      <!--          图片文件类型支持PNG、JPG、JPEG、BMP，图片大小不超过4M；为避免给您带来风险，请勿上传敏感保密或违法违规数据。-->
      <!--        </div>-->
      <!-- </div> -->
      <!--主体-->
      <div class="flex flex-1 bgc-white padding-top-24 padding-bottom-24 margin-top-8 margin-bottom-16 box-shadow-1" style="width: 100%;background: #F6FAFF;">
        <div class="flex justify-around" style="max-height: 534px;height: 100%;width: 100%">
          <!--左-->
          <div class="flex align-center box-shadow-1 bgc-white" style="width: 75%;height: 100%;">
            <!--有内容-->
            <div v-if="HadContent" style="width: 100%;height: 100%;">
              <!--图像分类 x标签-->
              <el-carousel v-if="modelTypeName==='图像分类-单标签' || modelTypeName==='图像分类-多标签'" style="height: 100%;" :autoplay="false" @change="changeResultIndex">
                <el-carousel-item v-for="(item,index) in result.data.images" :key="index" style="height: 100%;">
                  <div style="width: 100%;height: 100%;">
                    <image-show :src="item" />
                  </div>
                </el-carousel-item>
              </el-carousel>
              <!--回归预测模型-->
              <el-table
                v-if="modelTypeName==='回归预测模型'"
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
              <div v-if="modelTypeName==='图像分割'" class="flex" style="width: 100%;height: 100%;position: relative;">
                <div style="width: 100%;height: 100%;">
                  <image-show :src="result.data.images[0]" />
                </div>
                <div style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;opacity: 0.9;">
                  <image-show :src="result.data.images[1]" />
                </div>
              </div>
              <!--分类模型-->
              <div v-if="modelTypeName==='分类模型'" style="width: 100%;height: 100%;">
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
                v-if="modelTypeName==='文本分类-多标签' || modelTypeName==='文本分类-单标签'"
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
              <el-carousel v-if="modelTypeName==='物体检测'" style="height: 100%;width: 100%;" :autoplay="false" @change="changeResultIndex">
                <el-carousel-item v-for="(item,index) in result.data.images" :key="index" style="width: 100%;height: 100%;">
                  <div style="width: 100%;height: 100%;">
                    <image-with-rectangle :rectangle-list="result.labelString[resultIndex]" :color="colorList" :pic-size="result.labelString[resultIndex][0] && result.labelString[resultIndex][0].picSize" :pic-url="item" />
                  </div>
                </el-carousel-item>
              </el-carousel>
              <!--文本实体抽取-->
              <text-entity-extraction-left
                v-if="modelTypeName==='文本实体抽取'"
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
              <title-style v-if="modelTypeName!=='文本实体抽取'" title="识别信息" not-margin-bottom />
              <title-style v-if="modelTypeName==='文本实体抽取'" title="命名实体类型" not-margin-bottom />
            </div>
            <!--内容-->
            <div v-if="HadContent" class="flex flex-1 flex-direction padding-left-16 padding-right-16 overflow-auto" style="width: 100%;">
              <!--图像分类 x标签-->
              <template v-for="(item,index) in result.labelString[resultIndex]">
                <div
                  v-if="modelTypeName==='图像分类-单标签' || modelTypeName==='图像分类-多标签'"
                  :key="index"
                  class="flex align-center bgc-blue-light margin-top-24 border-radius-4"
                  style="width: 100%;height: 40px;"
                >
                  <span class="margin-left-8 margin-right-8" style="min-width: 46px;">{{ item.name }}</span>
                  <span class="text-hidden" style="">{{ Number(item.value).toFixed(6) }}</span>
                </div>
              </template>
              <!--回归-->
              <div v-if="modelTypeName==='回归预测模型'" style="width: 100%;height: 100%;">
                <el-table border :data="result.label" height="100%">
                  <el-table-column prop="value" label="预测值" />
                </el-table>
              </div>
              <!--图像分割-->
              <template v-for="(item,index) in result.labelString[0]">
                <div
                  v-if="modelTypeName==='图像分割'"
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
              <div v-if="modelTypeName==='分类模型' && result!=null" style="width: 100%;height: 100%;">
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
                  v-if=""
                  v-if="(modelTypeName==='文本分类-多标签' || modelTypeName==='文本分类-单标签') && result"
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
                  v-if="modelTypeName==='物体检测' && result!=null"
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
                v-if="modelTypeName==='文本实体抽取'"
                :color-list="colorList"
                :data="result.labelString"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleStyle from '@/components/TitleStyle';
import UploadFile from '@/components/UploadFile';

import { modelExperience, modelExperienceV2 } from '@/api/model';
import TextEntityExtractionLeft from '@/components/TextEntityExtractionLeft';
import TextEntityExtractionRight from '@/components/TextEntityExtractionRight';
export default {
  name: 'Index',
  components: {
    TextEntityExtractionRight,
    TextEntityExtractionLeft,
    TitleStyle,
    UploadFile,
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
      modelTypeName: '',
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
    this.id = this.$route.params.id;
    this.modelName = this.$route.params.modelName;
    this.modelTypeName = this.$route.params.modelTypeName;
    this.upLoadOk(null);
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
    upLoadOk(item) {
      this.upLoadCancel();
      if (item != null) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.loading = true;
        // const params = {
        //   'id': this.id,
        //   'labelStudioProjectId': item.labelStudioProjectId,
        //   'dataSetAddr': ''
        // };
        modelExperienceV2(this.id).then(res => {
          this.loading = false;
          this.HadContent = true;
          this.result = res.data;

          // if(this.result.csvData==undefined || this.result.csvData==null){
          //   this.result.csvData = this.result.txtData
          // }
          if (this.modelTypeName === '回归预测模型' || this.modelTypeName === '分类模型') {
            const newLabel = [];
            for (let i = 0; i < this.result.label.length; i++) {
              newLabel.push({
                value: Number(this.result.label[i]).toFixed(6)
              });
            }
            this.result.label = newLabel;

            if (this.modelTypeName === '分类模型' && this.result.csvData === undefined) {
              return;
            }

            const newCsvTitle = [];
            for (let i = 0; i < this.result.csvData[0].length; i++) {
              newCsvTitle.push(this.result.csvData[0][i]);
            }
            this.result.csvTitle = newCsvTitle;
            this.result.csvData.splice(0, 1);
            const newCsvData = [];
            for (let i = 0; i < this.result.csvData.length; i++) {
              const params = {};
              for (let j = 0; j < this.result.csvData[i].length; j++) {
                params[this.result.csvTitle[j]] = this.result.csvData[i][j];
              }
              newCsvData.push(params);
            }
            this.result.csvData = newCsvData;
          } else if (this.modelTypeName === '文本实体抽取') {
            for (let i = 0; i < this.result.labelString.length; i++) {
              this.colorRules[this.result.labelString[i]] = i;
            }
            this.modelExperienceIndex = this.result.labelString[0];
          }
        }).catch(res => {
          this.loading = false;
          this.HadContent = true;
          console.log(res);
          this.result = res.data;
        });
      } else {
        this.loading = true;
        // const params = {
        //   'id': this.id,
        //   'dataSetAddr': ''
        // };
        modelExperience(this.id).then(res => {
          this.loading = false;
          this.HadContent = true;
          this.result = res.data;

          // if(this.result.csvData==undefined || this.result.csvData==null){
          //   this.result.csvData = this.result.txtData
          // }
          if (this.modelTypeName === '回归预测模型' || this.modelTypeName === '分类模型') {
            const newLabel = [];
            for (let i = 0; i < this.result.label.length; i++) {
              newLabel.push({
                value: Number(this.result.label[i]).toFixed(6)
              });
            }
            this.result.label = newLabel;

            if (this.modelTypeName === '分类模型' && this.result.csvData === undefined) {
              return;
            }

            const newCsvTitle = [];
            for (let i = 0; i < this.result.csvData[0].length; i++) {
              newCsvTitle.push(this.result.csvData[0][i]);
            }
            this.result.csvTitle = newCsvTitle;
            this.result.csvData.splice(0, 1);
            const newCsvData = [];
            for (let i = 0; i < this.result.csvData.length; i++) {
              const params = {};
              for (let j = 0; j < this.result.csvData[i].length; j++) {
                params[this.result.csvTitle[j]] = this.result.csvData[i][j];
              }
              newCsvData.push(params);
            }
            this.result.csvData = newCsvData;
          } else if (this.modelTypeName === '文本实体抽取') {
            for (let i = 0; i < this.result.labelString.length; i++) {
              this.colorRules[this.result.labelString[i]] = i;
            }
            this.modelExperienceIndex = this.result.labelString[0];
          }
        }).catch(res => {
          this.loading = false;
          this.HadContent = true;
          console.log(res);
          this.result = res.data;
        });
      }
    },
    upLoadCancel() {
      this.dialogVisible = false;
    },
    changeResultIndex(index) {
      this.resultIndex = index;
    }
  }
};
</script>

<style scoped>

.my-list:hover{
  background-color: #0164FF;
  color: white;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.hover-bgc-blue:hover{
  background-color: #E4EDF8;
}

</style>
