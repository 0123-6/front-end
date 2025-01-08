<template>
  <el-radio-group class="ProjectTypeCount ee-radio-group" v-model="projectType">
    <el-radio-button label="0">全部({{ data.all || 0 }})</el-radio-button>
    <el-radio-button v-for="n in project_type" :label="n.itemCode" :key="n.itemName">
      {{ n.itemName }}({{ data[n.itemCode.split('_')[0]] || 0 }})
    </el-radio-button>
  </el-radio-group>
</template>

<script>
import useDictStore from '@/store/modules/dict'
export default {
  name: 'ProjectTypeCount',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      ...useDictStore().getDicts(['project_type']),
      projectType: '0',
    }
  }
};
</script>