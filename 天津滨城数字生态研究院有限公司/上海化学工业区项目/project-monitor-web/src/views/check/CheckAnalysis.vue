<template>
  <el-container class="MessageList full-vh">
    <el-header class="ee-header pl-l pr-l is-shadow" height="72px">
      <el-form class="d-flex ai-center jc-between full-h" :model="form">
        <el-form-item label="项目创建时间:" class="mg0">
          <el-date-picker v-model="form.startDate" type="daterange" unlink-panels range-separator="~"
            start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="getDateShotcuts()" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" clearable />
        </el-form-item>
        <el-button class="ml12" type="primary" @click="goCheckList">
          <el-icon class="el-icon--left">
            <Histogram />
          </el-icon>绩效统计表
        </el-button>
      </el-form>
    </el-header>
    <el-main class="pl-l pr-l" style="padding-top: 0;">
      <ProjectTimeDist ref="ProjectTimeDist" class="mt16" :params="params" />
      <NodeFinishAnalysis ref="NodeFinishAnalysis" class="mt16" :params="params" />
    </el-main>
  </el-container>
</template>

<script>
import { getDateShotcuts } from '@/utils/index.js'
import ProjectTimeDist from './ProjectTimeDist.vue';
import NodeFinishAnalysis from './NodeFinishAnalysis.vue'

export default {
  name: 'CheckAnalysis',
  components: {
    ProjectTimeDist,
    NodeFinishAnalysis
  },
  data() {
    return {
      form: {
        startDate: []
      },
    }
  },
  computed: {
    params() {
      return {
        projectStartDate: this.form.startDate[0] || '',
        projectEndDate: this.form.startDate[1] || '',
      }
    }
  },
  created() {
  },
  methods: {
    getDateShotcuts,
    goCheckList() {
      this.$router.push(`/check/list`)
    },
    getDataList() {

    }
  }
};
</script>

<style lang="scss">
.CheckAnalysis {}
</style>

