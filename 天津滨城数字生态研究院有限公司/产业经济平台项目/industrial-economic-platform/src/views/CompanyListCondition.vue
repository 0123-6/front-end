<template>
  <div class="company-condition-wrap">
    <div class="caret-row"><i class="el-icon-caret-top"></i></div>
    <div class="title d-flex ai-center jc-between">
      <div class="d-flex ai-center">
        <span class="title-text">筛选条件</span>
      </div>
      <i class="el-icon-close" @click="$emit('close')"></i>
    </div>
    <el-form class="ee-form ee-form--bolder" :model="form" label-width="80px">
      <el-form-item label="地      区：">
        <ee-cascader
          ref="EeCascader"
          v-model="regionPaths"
          :options="regionTree"
          :props="regionProps"
          width="132px"
          clearable
          @change="changeRegion" />
      </el-form-item>
      <el-form-item class="fitem--checkbox" label="注册资本：">
        <el-checkbox-group class="ee-checkbox-group" v-model="form.regCapitals">
          <el-checkbox-button v-for="n in dicts.reg_capital_list" :label="n.itemCode" :key="n.itemCode">{{ n.itemName }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="fitem--checkbox" label="成立时间：">
        <el-checkbox-group class="ee-checkbox-group" v-model="form.setupDates">
          <el-checkbox-button v-for="n in dicts.setup_date_list" :label="n.itemCode" :key="n.itemCode">{{ n.itemName }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="高级选项：">
        <div class="d-flex ai-center flex-wrap">
          <el-select
            class="select-contactWay"
            v-model="form.contactWay"
            placeholder="联系方式"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('contactWay')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.contact_way" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <el-select
            class="select-intelProperty"
            v-model="form.intelProperty"
            placeholder="知识产权"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('intelProperty')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.intel_property" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <el-select
            class="select-negativeOpinion"
            v-model="form.negativeOpinion"
            placeholder="负面舆情"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('negativeOpinion')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.negative_opinion" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <el-select
            class="select-taxGrade"
            v-model="form.taxGrade"
            placeholder="税务评级"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('taxGrade')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.tax_grade" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <!-- <el-select
            class="select-capitalTypes"
            v-model="form.capitalTypes"
            placeholder="资本类型"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags>
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in []" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select> -->
          <el-select
            class="select-typeCodes"
            v-model="form.typeCodes"
            placeholder="企业类型"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('typeCodes')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.company_type" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <el-select
            class="select-so110Count"
            v-model="form.so110Count"
            placeholder="参保人数"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('so110Count')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.canbao_num_list" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
          <el-select
            class="select-financingTypes"
            v-model="form.financingTypes"
            placeholder="融资信息"
            :clearable="false"
            multiple
            popper-class="is-bordered"
            collapse-tags
            @change="handleSelectChange('financingTypes')">
            <div class="option-list d-flex ai-center flex-wrap">
              <el-option v-for="n in dicts.financingType" :label="n.itemName" :value="n.itemCode" :key="n.itemCode"></el-option>
            </div>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div class="d-flex ai-start c-tag-list">
      <span>已选条件：</span>
      <company-list-condition-tag :form="form" :dicts="dicts" @remove="handleRemove" />
      <el-button class="ee-button" size="small" type="primary" :disabled="loading" @click="handleConfirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import CompanyListConditionTag from './CompanyListConditionTag.vue';
import { centralCityCodes } from '@/utils/constant';

export default {
  components: {
    CompanyListConditionTag
  },
  mixins: [],
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      regionProps: {
        value: 'value',
        label: 'label',
        level: 'level',
        children: 'children'
      },
      tabId: '1',
      regionPaths: [],
      form: {
        regions: [],
        contactWay: [],
        intelProperty: [],
        negativeOpinion: [],
        taxGrade: [],
        capitalTypes: [],
        regCapitals: [],
        setupDates: [],
        typeCodes: [],
        so110Count: [],
        financingTypes: []
      },
      dicts: JSON.parse(localStorage.getItem('iep_platform_all_dict'))
    };
  },

  computed: {
    ...mapGetters([])
  },

  created() {
    const regionTree = JSON.parse(localStorage.getItem('iep_platform_region_dict'));
    regionTree[0].children.forEach((n) => {
      if (centralCityCodes.indexOf(n.value) > -1) {
        n.children = [
          {
            ...JSON.parse(JSON.stringify(n)),
            level: 2
          }
        ];
        n.children[0].children.forEach((c) => {
          c.level = 3;
        });
      }
    });
    this.regionTree = regionTree;
    this.dicts.company_type = this.dicts.company_type.concat(this.dicts.key_company);
  },

  methods: {
    changeRegion(val, nodeList) {
      this.form.regions = nodeList.map((n) => ({
        regionCode: n[n.length - 1].value,
        regionName: n[n.length - 1].label,
        regionNamePath: this.$refs.EeCascader.getTextByNodePath(n),
        regionLevel: n[n.length - 1].level
      }));
    },
    handleSelectChange(key) {
      if (this.form[key].length === 1) {
        if (this.form[key][0] === '') {
          this.form[key] = [];
        } else {
          this.form[key].push('');
        }
      }
    },
    handleRemove(key) {
      this.form[key] = [];
      if (key === 'regions') {
        this.regionPaths = [];
      }
    },
    handleConfirm() {
      const data = JSON.parse(JSON.stringify(this.form));
      Object.keys(data).forEach((n) => {
        data[n] = data[n].filter((m) => m !== '');
      });
      this.$emit('change', data);
      this.$emit('close');
    }
  }
};
</script>
<style lang='less'>
.company-condition-wrap {
  position: relative;
  margin-top: -46px;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0px 0px 14px 0px rgba(19, 38, 82, 0.08);
  z-index: 101;
  .el-select__tags-text {
    color: #555555;
    &::before {
      color: #555555;
    }
  }
  .select-contactWay {
    span.el-select__tags-text::before {
      content: '\8054\7CFB\65B9\5F0F\FF1A';
    }
  }
  .select-intelProperty {
    span.el-select__tags-text::before {
      content: '\77E5\8BC6\4EA7\6743\FF1A';
    }
  }
  .select-negativeOpinion {
    span.el-select__tags-text::before {
      content: '\8D1F\9762\8206\60C5\FF1A';
    }
  }
  .select-taxGrade {
    span.el-select__tags-text::before {
      content: '\7A0E\52A1\8BC4\7EA7\FF1A';
    }
  }
  .select-capitalTypes {
    span.el-select__tags-text::before {
      content: '\8D44\672C\7C7B\578B\FF1A';
    }
  }
  .select-typeCodes {
    span.el-select__tags-text::before {
      content: '\4F01\4E1A\7C7B\578B\FF1A';
    }
  }
  .select-so110Count {
    span.el-select__tags-text::before {
      content: '\53C2\4FDD\4EBA\6570\FF1A';
    }
  }
  .select-financingTypes {
    span.el-select__tags-text::before {
      content: '\878D\8D44\4FE1\606F\FF1A';
    }
  }
  .title {
    padding: 24px 15px 22px 24px;
    color: #356df6;
    font-size: 14px;
    font-weight: 400;
    &-text {
      color: #1d2129;
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
    }
    .el-icon-close {
      padding: 5px;
      color: #356df6;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .el-form {
    padding: 0 24px;
  }
  .el-input__inner {
    padding-left: 13px;
    border-radius: 2px;
    width: 132px;
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
