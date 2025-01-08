<template>
  <el-container class="ProjectDetail full-vh">
    <el-header class="ee-header ProjectDetail__header is-shadow d-flex ai-center pl-l" height="58px">
      <el-button class="is-single" size="small" @click="$router.go(-1)">
        <el-icon><arrow-left-bold /></el-icon>
      </el-button>
      <div class="d-flex ai-center f14 f-l3 ml12">
        <svg-icon icon-class="home-bread" width="24px" height="24px" />当前位置：
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/project' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="ProjectDetail__main" :class="{ 'flowchart-fullscreen': flowFullscreen }">
      <ProjectBaseInfo :params="detailParams" @ready="handleBaseReady" @refresh="handleChange" />
      <ProjectMilestone ref="ProjectMilestone" class="mt16" :params="detailParams" :isComplete="isComplete"
        :baseInfo="baseInfo" @refresh="handleChange" />
      <ProjectStageProgress ref="ProjectStageProgress" class="mt16" :class="'project-status--' + status"
        :params="detailParams" @refresh="handleChange" @fullscreen="handleFullscreen" />
    </el-main>
  </el-container>
</template>

<script>
import useProjectStore from '@/store/modules/project'
import ProjectBaseInfo from './ProjectBaseInfo';
import ProjectMilestone from './ProjectMilestone';
import ProjectStageProgress from './ProjectStageProgress';
export default {
  name: 'ProjectDetail',
  components: {
    ProjectBaseInfo,
    ProjectMilestone,
    ProjectStageProgress
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      detailParams: {},
      status: '',
      flowFullscreen: false,
      isComplete: false,
      baseInfo: {}
    }
  },
  watch: {
    show() {
      this.visible = true
    }
  },
  methods: {
    handleFullscreen() {
      this.flowFullscreen = !this.flowFullscreen
      this.$nextTick(() => {
        if (!this.flowFullscreen) {
          const ele = document.querySelector('.ProjectDetail__main')
          ele.scrollTop = ele.scrollHeight - ele.clientHeight
        }
        this.$refs.ProjectStageProgress.resetFlowchart()
      })
    },
    handleBaseReady(obj) {
      this.baseInfo = obj
      this.status = obj.statusCode
      this.isComplete = obj.projectSchedule === 100
    },
    handleChange() {
      console.log('ProjectDetail refresh')
      this.detailParams.refresh = !this.detailParams.refresh
      useProjectStore().setRefresh()
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="scss">
.ProjectDetail {
  &__main {
    padding: 16px 20px 20px;

    &.flowchart-fullscreen {
      padding: 0 !important;

      .ProjectBaseInfo,
      .ProjectProgress {
        display: none;
      }

      .ProjectStageProgress {
        margin-top: 0 !important;

        .flow-wrap {
          margin-top: 0;
          border-radius: 0;
        }

        .ee-flowchart {
          height: calc(100vh - 118px) !important;
        }

        .ee-title,
        .stage-wrap,
        .radio-row {
          display: none;
        }
      }
    }
  }
}
</style>