<template>
  <div class="policy-query-head">
    <div class="search-row">
      <div class="search-row-inner ee-view-content flex-center ai-center">
        <div class="search-input">
          <el-input class="ee-input is-large" placeholder="请输入政策名称" v-model="keyword" clearable @keydown.enter.native="handleSearch">
            <el-button slot="append" :disabled="loading" @click="handleSearch">搜 索</el-button>
          </el-input>
        </div>
        <el-popover popper-class="policy-query-condition-popper" v-model="showPopper" placement="bottom" width="70%" trigger="click">
          <div slot="reference" class="ee-finder flex-center ai-center">高级搜索</div>
          <div class="policy-list-condition">
            <el-form class="wrap-form ee-form ee-form--bolder" :model="form" label-width="80px">
              <el-form-item label="区      域：">
                <ee-cascader
                  ref="EeCascader"
                  v-model="form.regionPath"
                  placeholder="全部"
                  :options="regionTree"
                  :multiple="false"
                  autoResize
                  @change="confirmRegion" />
              </el-form-item>
              <el-form-item class="fitem--radio" label="发布机构：">
                <div class="d-flex ai-end">
                  <div class="flex-1" :style="{ overflow: 'hidden', maxHeight: showAllDepart ? '' : '68px' }">
                    <el-radio-group ref="radioGroupOrg" class="ee-radio-group" v-model="form.orgId" @change="changeOrg">
                      <el-radio-button label="">全部</el-radio-button>
                      <el-radio-button v-for="n in departmentList" :label="n" :key="n">{{ n }}</el-radio-button>
                    </el-radio-group>
                  </div>
                  <el-button
                    v-if="showOrgMore"
                    class="ee-button--back"
                    type="text"
                    @click="showAllDepart = !showAllDepart"
                    style="margin-bottom: 8px">
                    更多
                    <i :class="showAllDepart ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item class="fitem--radio" label="产业类别：">
                <div class="d-flex ai-end">
                  <div class="flex-1" :style="{ overflow: 'hidden', maxHeight: showAllChain ? '' : '68px' }">
                    <el-radio-group ref="radioGroupType" class="ee-radio-group" v-model="form.industryType" @change="changeIndustry">
                      <el-radio-button label="">全部</el-radio-button>
                      <span v-for="n in industryTypeList" :key="n.name">
                        <el-popover popper-class="ee-radio-popper" placement="bottom" width="600" trigger="hover">
                          <el-radio-button
                            slot="reference"
                            :class="{ 'is-active-v': n.list.find((c) => c + '__' + n.name === form.industryType) }"
                            :label="n.name">
                            <span>{{ n.name }}</span>
                          </el-radio-button>
                          <el-radio-group
                            class="ee-radio-group"
                            v-model="form.industryType"
                            @change="
                              (e) => {
                                changeIndustry(e, n.list);
                              }
                            ">
                            <el-radio-button v-for="c in n.list" :key="c" :label="c + '__' + n.name">{{ c }}</el-radio-button>
                          </el-radio-group>
                        </el-popover>
                      </span>
                    </el-radio-group>
                  </div>
                  <el-button v-if="showTypeMore" class="ee-button--back" type="text" @click="showAllChain = !showAllChain" style="margin-bottom: 8px">
                    更多
                    <i :class="showAllChain ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
            <div class="d-flex ai-start c-tag-list">
              <span>已选条件：</span>
              <policy-list-condition-tag :form="form" @remove="handleRemove" />
              <el-button class="ee-button" size="small" type="primary" :disabled="loading" @click="handleConfirm">确 定</el-button>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="hot-words ee-view-content flex-center ai-center" :style="{ visibility: hotwords.length > 0 ? 'visible' : 'hidden' }">
        <span class="hot-words__label">热门搜索：</span>
        <span v-for="(n, i) in hotwords" :key="i" @click="keyword = n">
          <span class="hot-words__no" :class="'no' + (i + 1)">{{ i + 1 }}.</span>
          <span class="hot-words__text" :title="n">{{ n.length < 15 ? n : n.substr(0, 15) + '...' }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import mixinRegion from '@/utils/mixinRegion';
import mixinIndustry from '@/utils/mixinIndustry';
import * as api from '@/api/policy';
import PolicyListConditionTag from './PolicyListConditionTag.vue';

export default {
  name: 'PolicyQueryHead',
  components: {
    PolicyListConditionTag
  },
  mixins: [mixinRegion, mixinIndustry],
  props: {
    params: {
      type: Object,
      default() {
        return {
          keyword: ''
        };
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPopper: false,
      hotwords: [],
      keyword: '',
      form: {
        regionPath: [],
        regionCode: '',
        regionCodeName: '',
        orgId: '',
        orgIdName: '',
        industryType: '',
        industryTypeName: ''
      },
      departmentList: [],
      showAllDepart: false,
      showOrgMore: false,
      showAllChain: false,
      showTypeMore: false
    };
  },
  watch: {
    params: {
      handler(val) {
        this.setFormVal(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['iep_platform_MENU_ID', 'iep_orgRegion'])
  },
  created() {
    this.getPolicyHotkeywords();
    this.setFormVal(this.params);
  },
  mounted() {
    // let path = [].concat(this.iep_orgRegion.regionPath);
    // if (this.form.regionPath.length === 0) {
    //   this.form.regionPath = path;
    //   this.$nextTick(() => {
    //     this.form.regionCode = this.iep_orgRegion.regionCode;
    //     this.form.regionCodeName = this.iep_orgRegion.regionName;
    //     this.getDepartmentList();
    //   });
    // }
  },
  methods: {
    afterChainListLoad() {
      this.$nextTick(() => {
        this.showTypeMore = this.$refs.radioGroupType.$el.getBoundingClientRect().height > 68;
      });
    },
    afterRegionLoad(tree) {
      this.$emit('regionTreeLoaded', tree);
    },
    handleConfirm() {
      this.keyword = '';
      this.$emit('search', {
        ...this.form,
        regionCodeName: this.$refs.EeCascader.inputValue,
        keyword: ''
      });
      this.showPopper = false;
    },
    handleSearch() {
      this.$emit('search', {
        keyword: this.keyword
      });
    },
    setFormVal(val) {
      console.log('PolicyQueryHead setFormVal', val);
      if (typeof val.keyword !== 'undefined') {
        this.keyword = val.keyword;
      }
      delete val.keyword;
      Object.assign(this.form, val);
      if (val.regionCode) {
        this.getDepartmentList();
      }
    },
    handleRemove(key) {
      this.form[key] = '';
      this.form[key + 'Name'] = '';
      if (key === 'regionCode') {
        this.form.regionPath = [];
        this.departmentList = [];
      }
    },
    confirmRegion(val, nodePath) {
      if (val.length > 0) {
        Object.assign(this.form, {
          regionCode: val[val.length - 1],
          regionCodeName: this.$refs.EeCascader.getTextByNodePath(nodePath)
        });
      } else {
        this.form.regionCode = '';
        this.form.regionCodeName = '';
      }
      this.clearDepartment();
      this.getDepartmentList();
    },
    clearDepartment() {
      this.departmentList = [];
      this.form.orgId = '';
      this.form.orgIdName = '';
    },
    changeOrg(val) {
      if (val) {
        // let one = this.departmentList.find((n) => n.id === val);
        this.$set(this.form, 'orgIdName', val);
      } else {
        this.$set(this.form, 'orgIdName', '');
      }
    },
    getDepartmentList() {
      const { regionCode } = this.form;
      if (regionCode) {
        api
          .getDepartmentList({
            area_code: regionCode === 'china' ? 86 : regionCode
          })
          .then(({ data }) => {
            if (data.code === 0) {
              this.departmentList = data.data.list;
              this.$nextTick(() => {
                this.showOrgMore = this.$refs.radioGroupOrg.$el.getBoundingClientRect().height > 68;
              });
            }
          });
      }
    },
    changeIndustry(val, list) {
      // if (val) {
      //   let one = list?list.find((n) => n === val):this.industryTypeList.find((n) => n.name === val);
      //   this.$set(this.form, 'industryTypeName', one.industryName);
      // } else {
      //   this.$set(this.form, 'industryTypeName', '');
      // }
      this.$set(this.form, 'industryTypeName', val ? val.split('__')[0] : '');
    },
    getPolicyHotkeywords() {
      api
        .getPolicyHotkeywords()
        .then(({ data }) => {
          if (data.code === 0) {
            this.hotwords = data.data.list;
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang='less'>
.policy-query-head {
  .search-row {
    padding-top: 50px;
    height: 168px;
    box-sizing: border-box;
    background: url('@/assets/images/company-search-bg.png') center no-repeat;
    background-size: 100% 100%;
    &-inner {
      position: relative;
    }
    .search-input {
      position: relative;
      width: 728px;
    }
  }
  .hot-words {
    padding-right: 180px;
    margin-top: 20px;
    line-height: 24px;
    &__label {
      color: #86909c;
    }
    &__text {
      cursor: pointer;
    }
    &__no {
      margin-left: 13px;
      font-family: D-DIN-Bold;
      color: #afafaf;
      &.no1 {
        color: #cc4f47;
      }
      &.no2 {
        color: #f8aa50;
      }
      &.no3 {
        color: #f8e750;
      }
    }
  }
}
.policy-query-condition-popper {
  padding: 0;
  margin-top: 22px !important;
  width: 70%;
  min-width: 1000px;
  max-width: 1344px;
  left: 50% !important;
  transform: translateX(-50%) !important;
  .popper__arrow {
    left: 50% !important;
    margin-left: 380px;
  }
  .ee-radio-group {
    display: block;
  }
}
.policy-list-condition {
  padding-top: 20px;
  position: relative;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08);
  .el-form {
    padding: 0 24px;
  }
  .el-input__inner {
    padding-left: 13px;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
  }
  .el-select {
    margin: 0 10px 5px 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .el-tag--info {
    &:first-child:not(:last-child) {
      display: none;
    }
  }
  .caret-row {
    width: 1060px;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .el-icon-caret-top {
    position: absolute;
    top: 0;
    right: 49px;
    color: #fff;
    font-size: 30px;
  }
}
</style>
