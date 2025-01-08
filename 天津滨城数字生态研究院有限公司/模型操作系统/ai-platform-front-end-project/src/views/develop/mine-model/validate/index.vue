<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-21 14:42:04
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-01 17:01:12
 * @FilePath: \ai-platform-front-end-project\src\views\develop\model-validate.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex flex-direction model-validate-container">
    <div class="model-validate-title-container">
      <div class="margin-left-20 font-size-16 font-weight color-content">
        模型校验
      </div>
      <div class="flex margin-right-16">
        <el-button
          class="return-btn"
          icon="el-icon-caret-left"
          @click="returnModelBase"
        >返回
        </el-button>
      </div>
    </div>
    <div
      v-loading="isLoad"
      class="flex flex-direction load-container"
      element-loading-text="校验中"
    >
      <el-row>
        <div class="flex align-center padding-bottom-8 margin-top-16 padding-left-16" style="width: 100%;">
          <el-button type="primary" @click="handleCheck">选择数据集</el-button>
          <!-- <div class="flex font-size-12 color-title-2 margin-left-16">
            图片文件类型支持PNG、JPG、JPEG、BMP，图片大小不超过4M；为避免给您带来风险，请勿上传敏感保密或违法违规数据。
          </div> -->
        </div>
      </el-row>
      <div class="flex flex-direction model-validate-from-container">
        <el-row
          :gutter="20"
          class="model-validate-from-detail"
        >
          <el-col :span="18">
            <!--左-->
            <div
              class="
                flex
                align-center
                box-shadow-1
                bgc-white
                model-validate-left-container
              "
            >
              <div v-if="initDataList.length > 0" class="model-validate-left-detail">
                <!-- 图像分类 -->
                <div v-if="currentModelType === 'ImageCategory'" class="imageCategory-container">
                  <el-carousel height="600px" :autoplay="false" @change="changeResultIndex">
                    <el-carousel-item
                      v-for="(item, index) in initDataList"
                      :key="index"
                    >
                      <div class="image-container">
                        <el-image
                          :src="item"
                          :fit="'cover'"
                          class="init-image-container"
                        />
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <!-- 回归模型|多分类 -->
                <div v-else-if="currentModelType === 'RpModel' || currentModelType === 'ClfModel'" class="rpModel-container">
                  <!-- <table>
                    <tr v-for="(item, index) in initDataList" :key="index">
                      <td v-for="(innerItem, innerIndex) in item" :key="index-innerIndex" :title="innerItem" :style="setTrStyle()">{{ innerItem }}</td>
                    </tr>
                  </table> -->
                  <el-table
                    ref="multipleTable"
                    border
                    :data="initDataList.slice(1, initDataList.length)"
                    @mousedown.native="mouseDownHandler"
                    @mouseup.native="mouseUpHandler"
                    @mousemove.native="mouseMoveHandler"
                  >
                    <el-table-column v-for="(item,index) in initDataList[0]" :key="index" :label="item" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{ scope.row[index] }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!-- 图片分割 -->
                <div v-else-if="currentModelType === 'ImageSegment'" class="imageSegment-container">
                  <el-image
                    :src="initDataList[0]"
                    :fit="'cover'"
                    class="init-image-container"
                  />
                  <el-image
                    :src="initDataList[1]"
                    :fit="'cover'"
                    class="mark-image-container"
                  />
                </div>
                <!--物体检测 -->
                <div v-else-if="currentModelType === 'ObjectTest'" class="objectTest-container">
                  <ImageWithLabel
                    v-if="initDataList.length === 1"
                    :label-config="labeledDataList[0]"
                    :image-url="initDataList && initDataList[0]"
                    :init-width="500"
                    :init-image-config="labeledDataList && labeledDataList[0][0].picSize"
                    :is-show-btn="false"
                    :high-canvas-label-info="highCanvasLabelInfo"
                    :is-need-change-rect-fill="true"
                    @changeRectFill="changeRectFill"
                  />
                  <ImageCarouselWithLabel
                    v-else
                    :label-config="labeledDataList"
                    :image-url-list="initDataList"
                    :init-width="500"
                    :high-canvas-label-info="highCanvasLabelInfo"
                    :is-need-change-rect-fill="true"
                    @changeRectFill="changeRectFill"
                    @changeCurrentIndex="changeResultIndex"
                  />
                </div>
                <!--文本标签-多标签 -->
                <div v-else-if="currentModelType === 'TextClassify'" class="textClassify-container">
                  <div
                    v-for="(item, index) in initDataList"
                    :key="index"
                    class="flex align-center label-container"
                    :class="{'active': resultIndex === index}"
                    @click="changeResultIndex(index)"
                  >
                    {{ item }}
                  </div>
                </div>
                <!--文本实体抽取 -->
                <div v-else-if="currentModelType === 'TextEntityExtraction'" class="textEntityExtraction-container">
                  <TextHighLight
                    :label-content="initDataList"
                    :label-callout="labeledDataList"
                    :current-high-labeled-type="currentHighLabeledInfo.name"
                  />
                </div>
              </div>
              <div
                v-else
                class="flex flex-direction justify-center align-center no-data"
              >
                <div class="flex margin-bottom-16">
                  <img src="@/assets/images/nothing.png" alt="">
                </div>
                <div class="flex font-size-16" style="color: #afaaaa">暂无内容</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <!--右-->
            <div
              class="
                flex
                flex-direction
                box-shadow-1
                bgc-white
                model-validate-right-container
              "
            >
              <!--识别信息-->
              <div class="flex border-bottom padding-16" style="padding-bottom:0px">
                <title-style :title="currentModelType === 'TextEntityExtraction'?'命名实体类型':'识别信息'" />
              </div>
              <!--内容-->
              <div
                v-if="initDataList.length>0"
                class="flex flex-direction padding-left-24 padding-right-24"
              >
                <template v-if="labeledDataList.length > 0">
                  <!--图片分类-->
                  <div v-if="currentModelType === 'ImageCategory'" class="imageCategory-container">
                    <div
                      v-for="(item, index) in labeledDataList[resultIndex]"
                      :key="index"
                      class="flex align-center bgc-blue-light margin-top-24 label-container"
                    >
                      <span class="margin-left-24 label-type-container">{{
                        item.name
                      }}</span>
                      <span
                        class="margin-left-24 value-type-container"
                        :title="getBit(item.value, 7)"
                      >
                        {{ getBit(item.value, 7) }}
                      </span>
                    </div>
                  </div>
                  <!--回归模型-->
                  <div v-else-if="currentModelType === 'RpModel'" class="rpModel-container">
                    <div class="label-title-container">预测值</div>
                    <div
                      v-for="(item, index) in labeledDataList"
                      :key="index"
                      class="label-container"
                    >
                      <span>{{ getBit(item, 7) }}</span>
                    </div>
                  </div>
                  <!--多分类-->
                  <div v-else-if="currentModelType === 'ClfModel'" class="clfModel-container">
                    <div class="label-title-container">预测概率</div>
                    <div
                      v-for="(item, index) in labeledDataList"
                      :key="index"
                      class="label-container"
                    >
                      <div
                        v-for="(innerItem, innerIndex) in item"
                        :key="index-innerIndex"
                        class="label-detail-container"
                      >
                        <span class="margin-left-24 label-type-container">{{
                          innerItem.name || '-'
                        }}</span>
                        <span
                          class="margin-left-24 value-type-container"
                          :title="getBit(innerItem.value, 7)"
                        >
                          {{ getBit(innerItem.value, 7) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!--图片分割-->
                  <div v-else-if="currentModelType === 'ImageSegment'" class="imageSegment-container">
                    <div
                      v-for="(item, index) in labeledDataList[0]"
                      :key="index"
                      class="flex align-center label-container"
                      :title="item.name"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                  <!--物体检测-->
                  <div v-else-if="currentModelType === 'ObjectTest'" class="objectTest-container">
                    <div
                      v-for="(item, index) in labeledDataList[resultIndex]"
                      :key="index"
                      class="label-container"
                      :style="setObjectTestStyle(item)"
                      @click="highCanvasLabel(item)"
                    >
                      <span class="margin-left-24 label-type-container" :title="item.name">{{
                        item.name || '-'
                      }}</span>
                      <span
                        class="margin-left-24 value-type-container"
                        :title="getBit(item.value, 7)"
                      >
                        {{ getBit(item.value, 7) }}
                      </span>
                    </div>
                  </div>
                  <!--文本标签-多标签 -->
                  <div v-if="currentModelType === 'TextClassify'" class="textClassify-container">
                    <div
                      v-for="(item, index) in labeledDataList[resultIndex]"
                      :key="index"
                      class="flex align-center margin-top-24 label-container"
                      :class="{'active': index === 0}"
                    >
                      <span
                        class="margin-left-24 label-type-container"
                        :title="item.name"
                      >{{
                        item.name
                      }}
                      </span>
                      <span
                        class="margin-left-24 value-type-container"
                        :title="getBit(item.value, 7)"
                      >
                        {{ getBit(item.value, 7) }}
                      </span>
                    </div>
                  </div>
                  <!--文本实体抽取 -->
                  <div v-if="currentModelType === 'TextEntityExtraction'" class="textEntityExtraction-container">
                    <div
                      v-for="(item, index) in labeledDataList"
                      :key="index"
                      class="flex align-center label-container"
                      :style="setTextEntityExtractionStyle(item)"
                      :title="item.name"
                      @click="changeCurrentHighLabeledInfo(item)"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </template>
                <div
                  v-else
                  class="flex flex-direction justify-center align-center no-data"
                >
                  <div class="flex margin-bottom-16 no-label-image ">
                    <img src="@/assets/images/nothing.png" alt="">
                  </div>
                  <div class="flex font-size-16" style="color: #afaaaa">未识别出结果</div>
                </div>
              </div>
              <div
                v-else
                class="flex flex-direction justify-center align-center no-data"
              >
                <div class="flex margin-bottom-16 no-all-image">
                  <img src="@/assets/images/nothing.png" alt="">
                </div>
                <div class="flex font-size-16" style="color: #afaaaa">暂无内容</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 校验选择数据弹框 -->
    <upload-file
      v-if="showUploadFileDialog"
      :is-show-tips="false"
      :form-web-type="'validate'"
      @ok="uploadFileOk"
      @cancel="uploadFileCancel"
    />
  </div>
</template>
<script>
import TextHighLight from '../../../../components/TextWithLabel/textHighLight';
import { getModelValidationDetail, createModelValidation } from '@/api/model.js';
import TitleStyle from '@/components/TitleStyle';
import UploadFile from '@/components/UploadFile';
import ImageWithLabel from '@/components/ImageWithLabel';
import ImageCarouselWithLabel from '@/components/ImageWithLabel/carousel.vue';

export default {
  components: {
    TextHighLight,
    TitleStyle,
    UploadFile,
    ImageWithLabel,
    ImageCarouselWithLabel
  },
  data() {
    return {
      initDataList: [],
      labeledDataList: [],
      resultIndex: 0,
      isLoad: false,
      currentModelType: '',
      JSONStr: '',
      showUploadFileDialog: false,
      checkedFrom: {
        id: '',
        selectedDataSet: {}
      },
      validationInterval: null,
      colorList: [
        { fillStyle: 'rgba(247,130,144,0.3)', strokeStyle: 'rgba(247,130,144,1)', activeStyle: 'rgba(247,130,144,0.7)' },
        { fillStyle: 'rgba(249,181,123,0.3)', strokeStyle: 'rgba(249,181,123,1)', activeStyle: 'rgba(249,181,123,0.7)' },
        { fillStyle: 'rgba(245,216,145,0.3)', strokeStyle: 'rgba(245,216,145,1)', activeStyle: 'rgba(245,216,145,0.7)' },
        { fillStyle: 'rgba(189,219,148,0.3)', strokeStyle: 'rgba(189,219,148,1)', activeStyle: 'rgba(189,219,148,0.7)' },
        { fillStyle: 'rgba(150,198,250,0.3)', strokeStyle: 'rgba(150,198,250,1)', activeStyle: 'rgba(150,198,250,0.7)' },
        { fillStyle: 'rgba(174,157,251,0.3)', strokeStyle: 'rgba(174,157,251,1)', activeStyle: 'rgba(174,157,251,0.7)' },
        { fillStyle: 'rgba(227,153,192,0.3)', strokeStyle: 'rgba(227,153,192,1)', activeStyle: 'rgba(227,153,192,0.7)' },
        { fillStyle: 'rgba(153,169,227,0.3)', strokeStyle: 'rgba(153,169,227,1)', activeStyle: 'rgba(153,169,227,0.7)' },
        { fillStyle: 'rgba(153,227,225,0.3)', strokeStyle: 'rgba(153,227,225,1)', activeStyle: 'rgba(153,227,225,0.7)' }
      ],
      highCanvasLabelInfo: null,
      currentHighLabeledInfo: null,
      mouseFlag: false,
      mouseOffset: 0
    };
  },
  destroyed() {
    clearInterval(this.validationInterval);
    this.validationInterval = null;
  },
  mounted() {
    this.getModelValidationDetail();
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
    // 返回
    returnModelBase() {
      this.$router.back();
    },
    // 切换
    changeResultIndex(index) {
      this.resultIndex = index;
    },
    // 获取数据详情
    getModelValidationDetail() {
      this.initDataList = [];
      this.labeledDataList = [];
      const params = {
        'id': this.$route.params.id
      };
      getModelValidationDetail(params.id).then(res => {
        if (res.code === '000000') {
          if (res.data.status === 'VERIFICATION_FAILED') {
            clearInterval(this.validationInterval);
            this.validationInterval = null;
            this.isLoad = false;
            this.$message.error('校验失败');
            this.initDataList = [];
            this.labeledDataList = [];
          } else if (res.data.status === 'INSPECTION_SUCCESSFUL') {
            this.isLoad = false;
            clearInterval(this.validationInterval);
            this.validationInterval = null;
            if (res.data.type.typeCode === 'RpModel') {
              // 回归模型
              this.currentModelType = 'RpModel';
              this.initDataList = res.data.csvData;
              this.labeledDataList = res.data.label;
            } else if (res.data.type.typeCode === 'ImageCategory') {
              // 图像分类
              this.currentModelType = 'ImageCategory';
              this.initDataList = res.data.data.images;
              this.labeledDataList = res.data.labelString;
            } else if (res.data.type.typeCode === 'ClfModel') {
              // 多分类
              this.currentModelType = 'ClfModel';
              this.initDataList = res.data.csvData;
              this.labeledDataList = res.data.labelString;
            } else if (res.data.type.typeCode === 'ImageSegment') {
              // 图像分割
              this.currentModelType = 'ImageSegment';
              this.initDataList = res.data.data.images;
              this.labeledDataList = res.data.labelString;
            } else if (res.data.type.typeCode === 'TextClassify') {
              // 文本标签-多标签
              this.currentModelType = 'TextClassify';
              this.initDataList = res.data.txtData;
              this.labeledDataList = res.data.labelString.map(item => {
                item.sort((a, b) => b.value - a.value);
                return item;
              });
            } else if (res.data.type.typeCode === 'ObjectTest') {
              // 物体检测
              this.currentModelType = 'ObjectTest';
              this.initDataList = res.data.data.images;
              this.labeledDataList = res.data.labelString.map((item) => {
                const labelDetail = item.map(labelItem => {
                  const colorIndex = item.findIndex(innerItem => { return innerItem.name === labelItem.name; });
                  labelItem.x = labelItem.cor.x1;
                  labelItem.y = labelItem.cor.y1;
                  labelItem.width = labelItem.cor.x2 - labelItem.cor.x1;
                  labelItem.height = labelItem.cor.y2 - labelItem.cor.y1;
                  labelItem.strokeStyle = this.colorList[colorIndex].strokeStyle;
                  labelItem.fillStyle = this.colorList[colorIndex].fillStyle;
                  labelItem.activeStyle = this.colorList[colorIndex].activeStyle;
                  return labelItem;
                });
                return labelDetail;
              });
            } else if (res.data.type.typeCode === 'TextEntityExtraction') {
              // 文本实体抽取
              this.currentModelType = 'TextEntityExtraction';
              res.data.data.map((item) => {
                const obj = {};
                obj.textDetail = item.text;
                obj.labelDetail = item.labels.map(labelItem => {
                  const colorIndex = item.labels.findIndex(innerItem => { return innerItem.type === labelItem.type; });
                  // labelItem.name = "新认定为国家级、省级两化融合示范"
                  labelItem.activeStyle = this.colorList[colorIndex].strokeStyle;
                  return labelItem;
                });
                this.initDataList.push(obj);
              });
              this.labeledDataList = res.data.labelString.map((item, index) => {
                const labelItem = {};
                labelItem.name = item;
                labelItem.strokeStyle = this.colorList[index].strokeStyle;
                labelItem.fillStyle = this.colorList[index].fillStyle;
                labelItem.activeStyle = this.colorList[index].activeStyle;
                return labelItem;
              });
              this.currentHighLabeledInfo = this.labeledDataList[0];
            }
          } else {
            this.initDataList = [];
            this.labeledDataList = [];
            this.isLoad = true;
            if (this.validationInterval) return;
            this.validationInterval = setInterval(() => {
              this.getModelValidationDetail();
            }, 3000);
          }
        } else {
          this.initDataList = [];
          this.labeledDataList = [];
          clearInterval(this.validationInterval);
          this.validationInterval = null;
        }
      }).catch(() => {
        this.initDataList = [];
        this.labeledDataList = [];
        clearInterval(this.validationInterval);
        this.validationInterval = null;
      });
    },
    // 格式化数据
    getBit(value, bit = 3) {
      let str = value.toString();
      const strIndex = str.indexOf('.');
      if (strIndex === -1) return str;
      str = str.substring(0, strIndex + bit);
      return str;
    },
    setTrStyle() {
      const width = parseInt(100 / this.initDataList[0].length);
      return {
        width: width + '%'
      };
    },
    /** 校验 */
    handleCheck() {
      this.showUploadFileDialog = true;
      this.checkedFrom.id = this.$route.params.id;
    },
    // 数据选择弹框-确定
    uploadFileOk(value) {
      this.checkedFrom.selectedDataSet = value;
      const params = {
        datasetId: this.checkedFrom.selectedDataSet.labelStudioProjectId,
        modelId: this.checkedFrom.id,
        f: 'f'
      };
      createModelValidation(params).then(res => {
        if (res.code === '000000') {
          this.isLoad = true;
          this.$message.success(res.data);
          this.getModelValidationDetail();
        }
      });
      this.uploadFileCancel();
    },
    // 数据选择弹框-取消
    uploadFileCancel() {
      this.showUploadFileDialog = false;
    },
    // 设置物体检测标签颜色
    setObjectTestStyle(item) {
      const style = {};
      const StrItem = JSON.stringify(item);
      const StrHighCanvasLabelInfo = JSON.stringify(this.highCanvasLabelInfo);
      if (StrItem === StrHighCanvasLabelInfo) {
        style.backgroundColor = item.strokeStyle;
        style.borderColor = item.strokeStyle;
        style.color = '#FFFFFF';
      } else {
        style.backgroundColor = item.fillStyle;
        style.borderColor = item.strokeStyle;
      }
      return style;
    },
    // 点击物体检测标签，canvas标注高亮
    highCanvasLabel(item) {
      this.highCanvasLabelInfo = item;
    },
    // 点击物体检测图标标注，高亮标签
    changeRectFill(value, index) {
      if (value === '') {
        this.highCanvasLabelInfo = {};
      }
      this.labeledDataList[index].map(item => {
        if (item.x === value.initRectX && item.y === value.initRectY) {
          this.highCanvasLabelInfo = item;
        }
      });
    },
    // 设置文本实体抽取标签颜色
    setTextEntityExtractionStyle(item) {
      const style = {};
      const StrItem = JSON.stringify(item);
      const StrCurrentHighLabeledInfo = JSON.stringify(this.currentHighLabeledInfo);
      if (StrItem === StrCurrentHighLabeledInfo) {
        style.backgroundColor = item.strokeStyle;
        style.borderColor = item.strokeStyle;
        style.color = '#FFFFFF';
      } else {
        style.backgroundColor = item.fillStyle;
        style.borderColor = item.strokeStyle;
      }
      return style;
    },
    // 点击标签，切换文本实体抽取标注高亮
    changeCurrentHighLabeledInfo(item) {
      this.currentHighLabeledInfo = item;
    }
  }
};
</script>
<style lang="scss" scoped>
.model-validate-container {
  width: 100%;
  height: calc(100vh - var(--header-height));
  background: #e4edf8;
  min-width: 1200px;

  .model-validate-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    min-height: 50px;
    background: #ffffff;
  }

  .load-container {
    width: 100%;
    height:100%;
  }
  .model-validate-from-container {
    width: calc(100% - 32px);
    height: 100%;
    background: #f6faff;
    padding: 24px;
    margin: 16px auto;
    box-shadow: 0 2px 6px 0 rgba(194, 199, 199, 0.5);
    border-radius: 1px;
    overflow: auto;

    .model-validate-from-detail {
      width: 100%;
      height: 100%;
      margin: 0 !important;
      .el-col {
        height: 600px;
      }
      .model-validate-left-container {
        width: 100%;
        height: 100%;
        .model-validate-left-detail {
          width: 100%;
          height: 100%;
          .imageCategory-container {
            .image-container {
              width:100%;
              height:100%;
              position: relative;
              .init-image-container {
                left: 50%;
                top: 50%;
                position: absolute;
                transform: translateY(-50%) translateX(-50%);
              }
            }
            }
          .rpModel-container {
            height: 600px;
            overflow: auto;
            padding: 16px;
            table {
              border-spacing: 0;
              width: 100%;
            }
            tr {
              & + tr {
                td {
                  border-top: none;
                }
              }
              &:first-of-type {
                background-color: #f8f8f9;
                color: #515a6e;
              }
            }
            td {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              border: 1px solid #eeeeee;
              padding: 0 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              & + td {
                border-left: none;
              }
            }
          }
          .imageSegment-container {
            margin-top: 16px;
            height: 500px;
            overflow: auto;
            position: relative;
            .init-image-container {
              left: 50%;
              top: 50%;
              position: absolute;
              transform: translateY(-50%) translateX(-50%);
            }
            .mark-image-container {
              opacity: 0.5;
              left: 50%;
              top: 50%;
              position: absolute;
              transform: translateX(-50%) translateY(-50%);
            }
          }
          .objectTest-container {
            margin-top: 16px;
            overflow: auto;
            position: relative;
          }
          .textClassify-container {
            overflow: auto;
            height: 100%;
            .label-container {
              height: 76px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              padding: 20px;
              cursor: pointer;
              &.active {
                background: #E4EFFF;
              }
            }
          }
          .textEntityExtraction-container {
            height: 600px;
            overflow: auto;
          }
        }
      }

      .model-validate-right-container {
        height: 100%;
        .rpModel-container {
          margin-top: 16px;
          height: 500px;
          overflow: auto;
          .label-title-container {
            height: 40px;
            line-height: 40px;
            background: #e4edf8;
            padding: 0 16px ;
          }
          .label-container {
            height: 40px;
            line-height: 40px;
            border: 1px solid #eeeeee;
            padding: 0 16px ;
            & + .label-container {
              border-top: none;
            }
          }
        }
        .imageCategory-container {
          .label-container {
            width: 100%;
            height: 40px;
            .label-type-container {
              width: 48px
            }
            .value-type-container {
              width: calc(100% - 80px);
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .clfModel-container {
          margin-top: 16px;
          height: 500px;
          overflow: auto;
          .label-title-container {
            height: 40px;
            line-height: 40px;
            background: #e4edf8;
            padding: 0 16px ;
          }
          .label-container {
            width: 100%;
            padding: 16px 0;
            border: 1px solid #eeeeee;
            & + .label-container {
              border-top: none;
            }
            .label-detail-container {
              width: 100%;
              .label-type-container {
                width: 80px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .value-type-container {
                width: calc(100% - 130px);
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .imageSegment-container {
          .label-container {
            padding: 8px 16px;
            background-color: rgba(1,100,255,0.14);
            border-radius: 4px;
            border-left: 5px solid #0358DC;
            max-width: 140px;
            display: inline-block;
            margin-top: 16px;
            margin-right: 16px;
            color: #646464;
          }
        }
        .objectTest-container {
          .label-container {
            padding: 8px;
            background-color: rgba(1,100,255,0.14);
            border-radius: 4px;
            border-left: 5px solid #0358DC;
            width: 70%;
            color: #646464;
            margin-top: 16px;
            cursor: pointer;
            .label-type-container {
              width: 60px;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .value-type-container {
              width: calc(100% - 100px);
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-left: 16px;
              text-align: right;
            }
          }
        }
        .textClassify-container {
          height: 500px;
          overflow: auto;
          .label-container {
            background: rgba(114,108,108,0.11);
            width: 100%;
            height: 40px;
            &.active {
              background: #0164FF;
              color: #ffffff;
            }
            .label-type-container {
              width: 120px;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .value-type-container {
              width: calc(100% - 120px);
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .textEntityExtraction-container {
          .label-container {
            padding: 8px;
            background-color: rgba(1,100,255,0.14);
            border-radius: 4px;
            border-left: 5px solid #0358DC;
            width: 70%;
            color: #646464;
            margin-top: 16px;
            cursor: pointer;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .no-data {
        width: 100%;
        height: 100%
      }

      .no-all-image {
        margin-top: -75px;
      }
      .no-label-image {
        margin-top: 135px;
      }
    }
  }
}
</style>
