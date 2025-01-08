<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-21 16:10:42
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 11:45:18
 * @FilePath: \intelligent-search-system-web\src\views\advanced-search\components\SearchFilter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="search-filter-container">
    <div class="time-container">
      <label class="title-label mb-2">时间选择</label>
      <el-radio-group class="w-full flex items-center text-black text-sm" v-model="timeRadio" @change="changeDate">
        <el-radio :label="1">时间不限</el-radio>
        <el-radio :label="2">1天</el-radio>
        <el-radio :label="3">1周</el-radio>
        <el-radio :label="4">自定义</el-radio>
      </el-radio-group>
      <el-date-picker
        class="mt-2"
        v-show="timeRadio === 4"
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="changeDate(4)">
      </el-date-picker>
    </div>
    <div class="device-container">
      <label class="title-label mb-2">监控点位置</label>
      <el-input placeholder="请输入监控点位置" @change="changeMonitoringPoint" v-model="filterData.monitoringPointLocation" clearable></el-input>
    </div>
    <!--位置类型-->
    <div class="load-type-container">
      <!--上-->
      <div class="w-full flex justify-between items-center">
        <!--左-->
        <div class="flex items-center">
          <label class="title-label">位置类型</label>
          <el-checkbox style="margin-left: 14px;" checked @change="ev => changeAllSelectFilter(ev,'locationType')">全选</el-checkbox>
        </div>
        <!--右-->
        <div class="flex items-center">
          <div v-show="locationTypeList.length > 6" class="tip-container" @click="changeSelectFilterLength('locationType')">
            {{realLocationTypeList.length > 6 ? '收起' : '展开' }}
            <i :class="realLocationTypeList.length > 6 ? 'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="w-full grid grid-cols-3 gap-x-2.5 gap-y-2 mt-4">
        <!--每一项-->
        <el-tooltip v-for="item of realLocationTypeList"
                    :key="item.value"
                    effect="dark"
                    :disabled="item.name.length <= 6"
                    :content="item.name"
                    placement="top">
          <div
            class="tag-container"
            :class="{'active': filterData['locationType'].indexOf(item.value) >= 0}"
            @click="changeSelectFilter(item.value, 'locationType')"
          >
            {{item.name}}
          </div>
        </el-tooltip>
      </div>
    </div>
    <!--设备类型-->
    <div class="type-container">
      <!--上-->
      <div class="w-full flex justify-between items-center">
        <!--左-->
        <div class="flex items-center">
          <label class="title-label">设备类型</label>
          <el-checkbox style="margin-left: 14px;" checked @change="ev => changeAllSelectFilter(ev,'equipmentType')">全选</el-checkbox>
        </div>
        <!--右-->
        <div class="flex items-center">
          <div v-show="equipmentTypeList.length > 6" class="tip-container" @click="changeSelectFilterLength('equipmentType')">
            {{realEquipmentTypeList.length > 6 ? '收起' : '展开' }}
            <i :class="realEquipmentTypeList.length > 6 ? 'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="w-full grid grid-cols-3 gap-x-2.5 gap-y-2 mt-4">
        <!--每一项-->
        <el-tooltip v-for="item of realEquipmentTypeList"
                    :key="item.value"
                    effect="dark"
                    :disabled="item.name.length <= 6"
                    :content="item.name"
                    placement="top">
          <div
            class="tag-container"
            :class="{'active': filterData['equipmentType'].indexOf(item.value) >= 0}"
            @click="changeSelectFilter(item.value, 'equipmentType')"
          >{{item.name}}</div>
        </el-tooltip>
      </div>
    </div>
    <!--朝向-->
    <div class="towards-container">
      <!--上-->
      <div class="w-full flex justify-between items-center">
        <!--左-->
        <div class="flex items-center">
          <label class="title-label">朝向</label>
          <el-checkbox style="margin-left: 14px;" checked @change="ev => changeAllSelectFilter(ev,'orientation')">全选</el-checkbox>
        </div>
        <!--右-->
        <div class="flex items-center">
          <div v-show="orientationList.length > 6" class="tip-container" @click="changeSelectFilterLength('orientation')">
            {{realOrientationList.length > 6 ? '收起' : '展开' }}
            <i :class="realOrientationList.length > 6 ? 'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="w-full grid grid-cols-3 gap-x-2.5 gap-y-2 mt-4">
        <!--每一项-->
        <el-tooltip v-for="item of realOrientationList"
                    :key="item.value"
                    effect="dark"
                    :disabled="item.name.length <= 6"
                    :content="item.name"
                    placement="top">
          <div
            class="tag-container"
            :class="{'active': filterData['orientation'].indexOf(item.value) >= 0}"
            @click="changeSelectFilter(item.value, 'orientation')"
          >{{item.name}}</div>
        </el-tooltip>
      </div>
    </div>
    <!--模型-->
    <div class="model-container">
      <!--上-->
      <div class="w-full flex justify-between items-center">
        <!--左-->
        <div class="flex items-center">
          <label class="title-label">模型</label>
        </div>
        <!--右-->
        <div class="flex items-center">
          <div v-show="modelList.length > 6" class="tip-container"
               @click="changeSelectFilterLength('model')">
            {{modelPush ? '收起' : '展开' }}
            <i :class="modelPush ? 'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="w-full flex flex-col mt-2">
        <!--每一项模型-->
        <div class="w-full flex"
             style="margin-bottom: 6px;"
             v-for="(item, index) in modelList"
             :key="index">
          <div class="w-full flex items-center"
               v-if="modelPush ? true : index < 7">
            <!--左-->
            <el-tooltip effect="dark"
                        :content="item.modelName"
                        :disabled="item.modelName.length <= 5"
                        placement="top">
              <div class="flex text-hidden text-sm text-black-light"
                   style="width: 72px;">
                {{item.modelName}}
              </div>
            </el-tooltip>
            <!--右-->
            <div class="flex" style="width: calc(100% - 72px);">
              <el-select v-model="filterData.model[index].labels" clearable
                         multiple collapse-tags
                         :placeholder="'选择'+item.modelName"
                         @change="value => changeSelectModelLabel(value, item.modelId)">
                <el-option
                  v-for="innerItem in item.labels"
                  :key="item.modelId + '-' + innerItem.value"
                  :label="innerItem.name"
                  :value="innerItem.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { searchConfig } from '@/api/search';
import { changeTimeToBegin, changeTimeToLast } from '@/utils/date';

export default {
  name: 'SearchFilter',
  data() {
    return {
      timeRadio: 1,
      dateRange: [],
      equipmentTypeList: [],
      realEquipmentTypeList: [],
      // 全部位置类型
      locationTypeList: [],
      // 展示的全部位置类型
      realLocationTypeList: [],
      orientationList: [],
      realOrientationList: [],
      modelList: [],
      // 选中的结果
      filterData: {
        time: {
          startTime: '',
          endTime: ''
        },
        monitoringPointLocation: '',
        locationType: [],
        equipmentType: [],
        orientation: [],
        model: []
      },
      selectModelList: [],
      selectLabelList: [],
      // 模型是否展开
      modelPush: false
    };
  },
  async mounted() {
    await this.getConfigList();
    this.filterData.time.startTime = '';
    this.filterData.time.endTime = '';
    this.filterData.locationType = this.locationTypeList.map((item) => item.value);
    this.filterData.equipmentType = this.equipmentTypeList.map((item) => item.value);
    this.filterData.orientation = this.orientationList.map((item) => item.value);
    this.$emit('conditionChange', this.filterData);
  },
  methods: {
    // 输入框
    changeMonitoringPoint() {
      this.$emit('conditionChange', this.filterData);
    },
    // 全选
    changeAllSelectFilter(ev, type) {
      if (ev) {
        if (type === 'locationType') {
          this.filterData[type] = this.locationTypeList.map((item) => item.value);
        } else if (type === 'equipmentType') {
          this.filterData[type] = this.equipmentTypeList.map((item) => item.value);
        } else if (type === 'orientation') {
          this.filterData[type] = this.orientationList.map((item) => item.value);
        }
      } else {
        this.filterData[type] = [];
      }
      this.$emit('conditionChange', this.filterData);
    },
    // 单选
    changeSelectFilter(value, type) {
      const index = this.filterData[type].indexOf(value);
      if (index >= 0) {
        this.filterData[type].splice(index, 1);
      } else {
        this.filterData[type].unshift(value);
      }
      this.$emit('conditionChange', this.filterData);
    },
    changeSelectModel(value) {
      this.filterData.model = [];
      this.selectModelList.forEach((item) => {
        const params = {
          modelId: item,
          labels: this.selectLabelList[item]
        };
        this.filterData.model.push(params);
      });
      this.$emit('conditionChange', this.filterData);
    },
    changeSelectModelLabel(value, modelId) {
      this.$emit('conditionChange', this.filterData);
    },
    // 改变时间
    changeDate(value) {
      const today = new Date();
      switch (value) {
        case 1:
          this.filterData.time.startTime = '';
          this.filterData.time.endTime = '';
          break;
        case 2:
          this.filterData.time.startTime = changeTimeToBegin(today);
          this.filterData.time.endTime = changeTimeToLast(today);
          break;
        case 3:
          this.filterData.time.startTime = changeTimeToBegin(dayjs().subtract(6, 'day').format('YYYY-MM-DD hh:mm:ss'));
          this.filterData.time.endTime = changeTimeToLast(today);
          break;
        case 4:
          this.filterData.time.startTime = changeTimeToBegin(new Date(this.dateRange[0]));
          this.filterData.time.endTime = changeTimeToLast(new Date(this.dateRange[1]));
          break;
        default:
          this.filterData.time.startTime = '';
          this.filterData.time.endTime = '';
          break;
      }
      this.$emit('conditionChange', this.filterData);
    },
    // 改变时间
    changeDateRange(value) {
      if (value.length > 0) {
        const [startTime, endTime] = value;
        this.filterData.time.startTime = startTime;
        this.filterData.time.endTime = endTime;
      } else {
        this.filterData.time.startTime = '';
        this.filterData.time.endTime = '';
      }
      this.$emit('conditionChange', this.filterData);
    },
    // 获取初始化参数
    async getConfigList() {
      await searchConfig().then((result) => {
        console.log('set');
        // 设备类型
        this.equipmentTypeList = result.data.equipmentType;
        this.realEquipmentTypeList = result.data.equipmentType.slice(0, 6);
        // 位置类型
        this.locationTypeList = result.data.locationType;
        this.realLocationTypeList = result.data.locationType.slice(0, 6);
        // 朝向
        this.orientationList = result.data.orientation;
        this.realOrientationList = result.data.orientation.slice(0, 6);
        // 模型
        this.modelList = result.data.model;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.modelList.length; i++) {
          this.filterData.model.push({
            modelId: this.modelList[i].modelId,
            labels: []
          });
        }
      });
    },
    // 展开按钮
    changeSelectFilterLength(type) {
      if (type === 'locationType') {
        if (this.realLocationTypeList.length > 6) {
          this.realLocationTypeList = [...this.locationTypeList].splice(0, 6);
        } else {
          this.realLocationTypeList = [...this.locationTypeList];
        }
      } else if (type === 'equipmentType') {
        if (this.realEquipmentType.length > 6) {
          this.realEquipmentType = [...this.equipmentType].splice(0, 6);
        } else {
          this.realEquipmentType = [...this.equipmentType];
        }
      } else if (type === 'orientation') {
        if (this.realOrientationList.length > 6) {
          this.realOrientationList = [...this.orientationList].splice(0, 6);
        } else {
          this.realOrientationList = [...this.orientationList];
        }
      } else if (type === 'model') {
        this.modelPush = !this.modelPush;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';
.search-filter-container {
  width: 302px;
  padding-left: 16px;
  padding-right: 16px;
  .time-container {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
  }
  .title-label {
    color: @text-primary-dark;
    font-weight: 600;
    display: inline-block;
    font-size: 14px;
    line-height: 14px;
  }
  .device-container,.load-type-container,.type-container,.towards-container,.model-container {
    margin-top: 32px;
  }
  .tag-container {
    cursor: pointer;
    background: #F7FAF9;
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
    color: @text-light;
    width: 100%;
    height: 28px;
    line-height: 28px;
    .ellipsis-muti-line(1);
    &.active {
      background: #EDF2F5;
      color: @text-lighter;
      font-weight: 600;
    }
  }
  .el-col-8 {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .model-container {
    .checkbox-container {
      height: 50px;
      line-height: 50px;
    }
  }
  .tip-container {
    color: @text-light;
    font-size: 12px;
    float: right;
    cursor: pointer;
  }
}

::v-deep {
  .el-radio {
    font-size: 14px;
    color: #646464;
    line-height: 14px;
    font-weight: 400;
    margin-right: 20px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
  .el-radio__inner {
    width: 12px;
    height: 12px;
  }
  .el-range-editor--medium.el-input__inner {
    width: 100%;
  }
  .el-date-editor .el-range-separator {
    padding: 0;
  }
  .el-checkbox__label {
    padding-left: 4px;
    line-height: 12px;
    font-size: 12px;
  }
  .el-checkbox__inner {
    width: 12px;
    height: 12px;
    border-color: #0C61AA!important;
  }
  .el-input--medium .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .el-select__tags {
    max-width: unset!important;
  }
  .el-select__tags-text {
    max-width: 86px;
  }
  .el-checkbox__inner::after {
    left: 3px;
    top: 0;
  }
  .el-checkbox__inner:hover {
    border-color: #0C61AA;
  }
  .el-checkbox {
    color: #646464;
    font-size: 12px;
  }
}
</style>
