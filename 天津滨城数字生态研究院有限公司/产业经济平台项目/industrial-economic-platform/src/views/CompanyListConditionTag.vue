<template>
  <div class="d-flex ai-center flex-wrap flex-1">
    <slot></slot>
    <div v-if="form.regions.length > 0" class="d-flex ai-center c-tag-item">
      地区：
      <span class="value flex-1">{{ form.regions.map((n) => n.regionNamePath).join('、') }}</span>
      <i class="el-icon-close" @click="handleRemove('regions')"></i>
    </div>
    <div v-if="form.regCapitals.length > 0" class="d-flex ai-center c-tag-item">
      注册资本：
      <span class="value flex-1">{{
        dicts.reg_capital_list
          .filter((n) => form.regCapitals.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('regCapitals')"></i>
    </div>
    <div v-if="form.setupDates.length > 0" class="d-flex ai-center c-tag-item">
      成立时间：
      <span class="value flex-1">{{
        dicts.setup_date_list
          .filter((n) => form.setupDates.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('setupDates')"></i>
    </div>

    <div v-if="form.contactWay.length > 0" class="d-flex ai-center c-tag-item">
      联系方式：
      <span class="value flex-1">{{
        dicts.contact_way
          .filter((n) => form.contactWay.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('contactWay')"></i>
    </div>
    <div v-if="form.intelProperty.length > 0" class="d-flex ai-center c-tag-item">
      知识产权：
      <span class="value flex-1">{{
        dicts.intel_property
          .filter((n) => form.intelProperty.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('intelProperty')"></i>
    </div>
    <div v-if="form.negativeOpinion.length > 0" class="d-flex ai-center c-tag-item">
      负面舆情：
      <span class="value flex-1">{{
        dicts.negative_opinion
          .filter((n) => form.negativeOpinion.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('negativeOpinion')"></i>
    </div>
    <div v-if="form.taxGrade.length > 0" class="d-flex ai-center c-tag-item">
      税务评级：
      <span class="value flex-1">{{
        dicts.tax_grade
          .filter((n) => form.taxGrade.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('taxGrade')"></i>
    </div>
    <div v-if="form.capitalTypes.length > 0" class="d-flex ai-center c-tag-item">
      资本类型：
      <span class="value flex-1">{{
        dicts.capital_type
          .filter((n) => form.capitalTypes.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('capitalTypes')"></i>
    </div>

    <div v-if="form.typeCodes.length > 0" class="d-flex ai-center c-tag-item">
      企业类型：
      <span class="value flex-1">{{
        dicts.company_type
          .filter((n) => form.typeCodes.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('typeCodes')"></i>
    </div>
    <div v-if="form.so110Count.length > 0" class="d-flex ai-center c-tag-item">
      参保人数：
      <span class="value flex-1">{{
        dicts.canbao_num_list
          .filter((n) => form.so110Count.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('so110Count')"></i>
    </div>
    <div v-if="form.financingTypes.length > 0" class="d-flex ai-center c-tag-item">
      融资信息：
      <span class="value flex-1">{{
        dicts.financingType
          .filter((n) => form.financingTypes.indexOf(n.itemCode) > -1)
          .map((n) => n.itemName)
          .join('、')
      }}</span>
      <i class="el-icon-close" @click="handleRemove('financingTypes')"></i>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    dicts: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  created() {},

  mounted() {},

  methods: {
    handleRemove(key) {
      this.$emit('remove', key);
    }
  }
};
</script>
<style lang='less'>
</style>
