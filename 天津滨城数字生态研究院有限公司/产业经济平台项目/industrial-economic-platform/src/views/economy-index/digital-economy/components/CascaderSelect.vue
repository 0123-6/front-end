<template>
  <div
    class="cascader-select d-flex"
    :class="{ 'is-open': visible, 'is-single': !multiple, 'has-value': hasValue, 'is-button-mode': buttonMode, clearable: clearable }"
  >
    <div class="cascader-select__inner" :style="{ width: width === '100%' ? '100%' : 'auto' }">
      <template v-if="buttonMode">
        <el-button id="button-9cs123" v-popover:popover class="ee-button" size="small" :disabled="disabled" type="primary" :icon="showButtonIcon ? 'el-icon-plus' : null" plain>{{
          placeholder
        }}</el-button>
      </template>
      <template v-else-if="mode === 'text'">
        <div class="tw-flex tw-items-center tw-cursor-pointer" v-popover:popover @click.prevent="">
          <img src="./icon/定位.svg" alt="" style="width: 14px;height: 18px;">
          <!--选择的地区-->
          <div class="tw-flex tw-items-center tw-justify-center tw-text-[#5B5858] tw-text-base tw-ml-[8px]">
            {{ hasValue ? value : placeholder }}
          </div>
        </div>
      </template>
      <template v-else>
        <el-input
          ref="input"
          v-popover:popover
          :class="{ 'is-up': visible }"
          :placeholder="placeholder"
          v-model="value"
          readonly
          suffix-icon="el-icon-arrow-down"
          :style="{ width }"
        >
        </el-input>
        <i v-if="clearable && hasValue" class="el-icon-circle-close clear-value" @click="handleClear"></i>
      </template>
    </div>
    <div v-if="showValueList && multiple" class="value-list d-flex ai-start flex-wrap flex-1">
      <div v-for="n in valueList" :key="n.regionCode" class="d-flex ai-center c-tag-item">
        {{ n.names }}
        <i class="el-icon-close" @click="removeValue(n)"></i>
      </div>
    </div>
    <slot></slot>
    <el-popover
      ref="popover"
      popper-class="is-cascader-select is-bordered"
      v-model="visible"
      placement="bottom"
      title="-"
      width="700"
      :trigger="(buttonMode || mode === 'text') ? 'click' : 'focus'"
    >
      <div v-if="showCountry"
           class=""
      >
        <div class="tw-flex tw-items-center"
             @click="clickCountry"
        >
          <span class="tw-text-sm tw-text-[#1A262C] tw-leading-[20px] item tw-mb-0" style="margin-bottom: 0;">全国</span>
        </div>
      </div>
      <el-tabs v-model="tabId">
        <el-tab-pane label="省份" name="1" :disabled="!showProvince">
          <div class="d-flex ai-center flex-wrap">
            <div
              v-for="n in options"
              :key="n[valueProp]"
              class="item"
              :class="{
                selected: province[valueProp] === n[valueProp],
                'is-disabled': isItemDisabled(n)
              }"
              @click="itemClick(n)"
            >
              {{ n[labelProp] }}
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="市" name="2" :disabled="!showCity">
          <div class="d-flex ai-center flex-wrap">
            <div
              v-for="n in cityList"
              :key="n[valueProp]"
              class="item"
              :class="{ selected: city[valueProp] === n[valueProp], 'is-disabled': isItemDisabled(n) }"
              @click="itemClick(n)"
            >
              {{ n[labelProp] }}
            </div>
          </div>
          <div v-show="cityList.length == 0" class="nodata">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane label="区" name="3" :disabled="!showDistrict">
          <div class="d-flex ai-center flex-wrap">
            <div
              v-for="n in districtList"
              :key="n[valueProp]"
              class="item"
              :class="{ selected: district[valueProp] === n[valueProp], 'is-disabled': isItemDisabled(n) }"
              @click="itemClick(n)"
            >
              {{ n[labelProp] }}
            </div>
          </div>
          <div v-show="districtList.length == 0" class="nodata">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
      <div class="d-flex ai-center jc-end" style="margin-top: 10px">
        <el-button class="ee-button" size="small" @click="handleCancel">取 消</el-button>
        <el-button class="ee-button" size="small" type="primary" @click="handleConfirm" style="margin-left: 10px">确 定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
/* eslint-disable */

// 直辖市
const centralCityCodes = ['110000', '120000', '310000', '500000', '810000'];

export default {
  name: 'CascaderSelect',
  components: {},
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    // defaultProps: {
    //   type: Object,
    //   default() {
    //     return {
    //       value: 'value',
    //       label: 'label',
    //       level: 'level'
    //     };
    //   }
    // },
    defaultValue: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // popper触发元素类型
    mode: {
      type: String,
      default: 'input'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: '请选择地区'
    },
    // 多选时是否展示选择结果
    showValueList: {
      type: Boolean,
      default: true
    },
    // true:已选的置灰不可选
    strictly: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default() {
        return ['province', 'city', 'district'];
        [1, 2, 3];
      }
    },
    // 可选择的行政区划级别
    valueLevels: {
      type: Array,
      default() {
        return [1, 2, 3];
      }
    },
    // 指定的省份
    provinceCode: {
      type: Number,
      default: null
    },
    width: {
      type: String,
      default: '450px'
    },
    // 是否展示按钮默认icon
    showButtonIcon: {
      type: Boolean,
      default: true
    },
    // 禁止选择的列表
    disabledList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否展示全国
    showCountry: {
      type: Boolean,
      required: false,
      default: false,
    },
    props: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      visible: false,
      tabId: '1',
      value: '',
      province: {},
      city: {},
      cityList: [],
      districtList: [],
      district: {},
      valueList: []
    };
  },
  computed: {
    defaultProps() {
      return Object.assign(
        {
          value: 'regionCode',
          label: 'regionName',
          level: 'regionLevel',
          children: 'children'
        },
        this.props
      );
    },
    buttonMode() {
      return this.mode === 'button';
    },
    valueProp() {
      return this.defaultProps.value;
    },
    labelProp() {
      return this.defaultProps.label;
    },
    levelProp() {
      return this.defaultProps.level;
    },
    childrenProp() {
      return this.defaultProps.children;
    },
    hasValue() {
      return !!this.value;
    },
    showProvince() {
      return this.tabs.indexOf('province') > -1;
    },
    showCity() {
      return this.tabs.indexOf('city') > -1;
    },
    showDistrict() {
      return this.tabs.indexOf('district') > -1;
    }
  },
  watch: {
    defaultValue(val) {
      this.setDefaultVal(val);
    }
  },
  created() {
    this.setDefaultVal(this.defaultValue);
  },
  methods: {
    clickCountry() {
      this.value = '全国';
      this.handleCancel();
      this.clearValueList();
      this.$emit('confirm', []);
    },
    isItemDisabled(n) {
      return (
        n.disabled ||
        (this.strictly &&
          this.valueList.find((v) => {
            return v.regionCode == n[this.valueProp];
          })) ||
        (this.disabledList.indexOf(Number(n[this.valueProp])) > -1)
      );
    },
    setDefaultVal(val) {
      if (val[this.valueProp]) {
        this.itemClick(val);
        this.handleConfirm();
      }
    },
    setValue(val) {
      this.value = val;
    },
    handleClear() {
      if (this.hasValue) {
        this.value = '';
        this.clearValueList();
        this.handleCancel();
        this.$emit('confirm', []);
      }
    },
    removeValue(item) {
      this.valueList = this.valueList.filter((n) => n.regionCode !== item.regionCode);
      this.$emit('confirm', [].concat(this.valueList));
    },
    clearValueList() {
      this.valueList = [];
    },
    handleCancel(close = true) {
      if (close) {
        this.visible = false;
      }
      this.province = {};
      this.city = {};
      this.cityList = [];
      this.district = {};
      this.districtList = [];
      this.tabId = '1';
    },
    handleConfirm() {
      if (!this.province[this.valueProp]) {
        return this.$message({
          type: 'warning',
          message: '请选择省份'
        });
      }
      const regionCode = this.district[this.valueProp] || this.city[this.valueProp] || this.province[this.valueProp];
      const children = this.district.children || this.city.children || this.province.children;
      if (this.multiple) {
        if (this.valueList.find((n) => n.regionCode == regionCode)) {
          return this.$message({
            type: 'warning',
            message: '已选择该地区'
          });
        }
      }
      const regionLevel =
        centralCityCodes.indexOf(regionCode) > -1
          ? 1
          : this[this.district[this.valueProp] ? 'district' : this.city[this.valueProp] ? 'city' : 'province'][this.levelProp];
      const current = {
        regionCode,
        regionLevel,
        names: Array.from(new Set([this.province[this.labelProp], this.city[this.labelProp], this.district[this.labelProp]].filter((n) => n))).join(
          '/'
        )
      };
      if (this.valueLevels.indexOf(regionLevel) < 0 && !centralCityCodes.includes(regionCode)) {
        return this.$message({
          type: 'warning',
          message: '不能选择该级别行政区划'
        });
      }
      // 如果是只能选市，根据provinceCode过滤，只能选中provinceCode下的市
      if (this.valueLevels.length === 1 && this.valueLevels[0] === 2 && this.provinceCode) {
        if (this.province[this.valueProp] != this.provinceCode) {
          return this.$message({
            type: 'warning',
            message: '不能选择该级别行政区划'
          });
        }
      }
      if (this.multiple) {
        this.valueList.push(current);
        this.handleCancel();
      } else {
        current.children = children;
        current.province = this.province;
        current.city = this.city;
        current.district = this.district;
        this.valueList = [current];
        this.value = this.valueList[0].names;
        this.visible = false;
      }
      this.$emit('confirm', [].concat(this.valueList));
    },
    itemClick(n) {
      if (this.isItemDisabled(n)) return;
      switch (this.tabId) {
        case '1':
          this.province = n;
          this.city = {};
          this.district = {};
          this.districtList = [];
          if (centralCityCodes.indexOf(n[this.valueProp]) > -1) {
            this.cityList = [n];
            // this.itemClick(n);
          } else {
            this.cityList = n.children;
          }
          if (this.showCity && this.cityList.length > 0) {
            this.tabId = '2';
          }
          break;
        case '2':
          this.city = n;
          this.district = {};
          this.districtList = n.children;
          if (this.showDistrict && this.districtList.length > 0) {
            this.tabId = '3';
          }
          break;
        case '3':
          this.district = n;
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang='less'>
.cascader-select {
  &__inner {
    position: relative;
    .el-button span{
      display: flex!important;
      font-size: 14px!important;
      font-weight: 400!important;
      line-height: 14px!important;
    }
    .el-button:not(.el-button--text).is-disabled {
      background-color: white!important;
      border-color: #DEDEDE!important;
      color: #C4C4C4!important;
    }
  }
  &.is-open {
    .el-input {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
  }
  &.has-value&.clearable {
    .cascader-select {
      &__inner {
        &:hover {
          .el-input__suffix {
            display: none;
          }
          .clear-value {
            display: inline-block;
          }
        }
      }
    }
  }
  &.is-button-mode {
    align-items: center;
    .c-tag-item {
      margin: 4px 8px 4px 0;
    }
  }
  .el-input {
    width: auto;
    height: 32px;
    cursor: pointer;
    &__inner {
      cursor: pointer;
    }
    .el-icon-arrow-down {
      transition: all 0.3s;
    }
  }
  .clear-value {
    display: none;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    padding: 5px 0;
    width: 25px;
    background: #fff;
    text-align: center;
    color: #c0c4cc;
    cursor: pointer;
    z-index: 1;
    &:hover {
      display: inline-block;
    }
  }
  .el-input__icon {
    line-height: 32px;
  }
  .value-list {
    padding-left: 14px;
  }
  .c-tag-item {
    margin: 6px 8px 2px 0;
  }
}
.is-cascader-select {
  padding: 8px 24px 14px !important;

  .el-popover__title {
    display: none;
  }

  .el-tabs__item {
    &.is-disabled {
      display: none;
    }
  }

  .item {
    margin: 0 20px 10px 0;
    padding: 0 10px;
    height: 29px;
    line-height: 29px;
    border-radius: 4px;
    background: #fff;
    color: #1d2129;
    cursor: pointer;
    &:hover {
      background: #f4f4f4;
    }
    &.selected {
      background: rgba(53, 109, 246, 0.1);
      color: #356df6;
    }
    &.is-disabled {
      color: #909399 !important;
      background: #fff;
      cursor: not-allowed;
    }
  }
  .nodata {
    padding-top: 96px;
    height: 64px;
    background: url('@/assets/icons/empty.svg') center no-repeat;
    background-size: 200px auto;
    color: #86909c;
    font-size: 14px;
    text-align: center;
  }
}
</style>
<style>
#button-9cs123 {
  padding: 6px 10px!important;
}
</style>
